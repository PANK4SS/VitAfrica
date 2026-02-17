package com.pankassi.backend.service;

import com.pankassi.accesscore.domain.model.Client;
import com.pankassi.accesscore.domain.repository.ClientRepository;
import com.pankassi.backend.domain.model.*;
import com.pankassi.backend.domain.repository.*;
import com.pankassi.backend.dto.request.AddPrescriptionRequest;
import com.pankassi.backend.dto.response.Doctor.*;
import com.pankassi.backend.dto.response.DrugResponse;
import com.pankassi.backend.dto.response.LabResultResponse;
import com.pankassi.backend.dto.response.PrescriptionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final ClientRepository clientRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalPrescriptionRepository prescriptionRepository;
    private final LabResultRepository labResultRepository;
    private final PatientRepository patientRepository;
    private final FileUploadService fileUploadService;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter HOUR_FMT = DateTimeFormatter.ofPattern("HH:mm");
    private static final DateTimeFormatter DATE_DISPLAY = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter DATETIME_DISPLAY = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    // ✅ Utilitaire
    private Doctor getAuthenticatedDoctor() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Client client = clientRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return doctorRepository.findByClient(client)
                .orElseThrow(() -> new IllegalArgumentException("Doctor profile not found"));
    }

    // ===== DASHBOARD =====
    @Transactional(readOnly = true)
    public DoctorDashboardResponse getDashboard() {
        Doctor doctor = getAuthenticatedDoctor();
        return new DoctorDashboardResponse(
                appointmentRepository.countByDoctorAndStatus(doctor, "CONFIRMED"),
                appointmentRepository.countByDoctorAndStatus(doctor, "COMPLETED")
        );
    }

    // ===== CONSULTATIONS LIST =====
    @Transactional(readOnly = true)
    public List<ConsultationSummaryResponse> getConsultations() {
        Doctor doctor = getAuthenticatedDoctor();

        return appointmentRepository
                .findByDoctorOrderByDateTimeDesc(doctor)
                .stream()
                .map(a -> new ConsultationSummaryResponse(
                        a.getAppointmentId(),
                        a.getPatient().getClient().getClientName(),
                        a.getPatient().getPhone(),
                        a.getPatient().getProfilePicUrl() != null ? a.getPatient().getProfilePicUrl() : "",
                        a.getDateTime().format(DATE_FMT),
                        a.getDateTime().format(HOUR_FMT),
                        a.getStatus()
                ))
                .toList();
    }

    // ===== CONSULTATION DETAIL =====
    @Transactional(readOnly = true)
    public ConsultationDetailResponse getConsultationDetail(Long appointmentId) {
        Doctor doctor = getAuthenticatedDoctor();

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));

        if (!appointment.getDoctor().getDoctorId().equals(doctor.getDoctorId())) {
            throw new IllegalStateException("Access denied");
        }

        Patient patient = appointment.getPatient();
        return new ConsultationDetailResponse(
                appointment.getAppointmentId(),
                patient.getClient().getClientName(),
                patient.getPhone(),
                patient.getLocationAddress(),
                patient.getProfilePicUrl(),
                appointment.getDateTime().format(DATE_FMT),
                appointment.getDateTime().format(HOUR_FMT),
                appointment.getStatus()
        );
    }

    // ===== ADD PRESCRIPTION =====
    @Transactional
    public void addPrescription(Long appointmentId, AddPrescriptionRequest request) {
        Doctor doctor = getAuthenticatedDoctor();

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));

        if (!appointment.getDoctor().getDoctorId().equals(doctor.getDoctorId())) {
            throw new IllegalStateException("Access denied");
        }

        Patient patient = appointment.getPatient();

        // ✅ Crée la prescription d'abord sans les drugs
        MedicalPrescription prescription = MedicalPrescription.builder()
                .patient(patient)
                .doctor(doctor)
                .prescriptionDate(LocalDate.now())
                .drugs(new ArrayList<>())
                .build();

        // ✅ Utilise les getters du record DrugRequest (pas .drugName() direct)
        for (var d : request.drugs()) {
            DrugPrescription drug = DrugPrescription.builder()
                    .drugName(d.drugName())
                    .dosage(d.dosage())
                    .frequency(d.frequency())
                    .durationDays(d.durationDays())
                    .prescription(prescription)
                    .build();
            prescription.getDrugs().add(drug);
        }

        prescriptionRepository.save(prescription);
    }

    // ===== UPLOAD LAB RESULT =====
    @Transactional
    public void uploadLabResult(Long appointmentId, MultipartFile file) {
        Doctor doctor = getAuthenticatedDoctor();

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));

        if (!appointment.getDoctor().getDoctorId().equals(doctor.getDoctorId())) {
            throw new IllegalStateException("Access denied");
        }

        try {
            // ✅ Appel correct — uploadLabResult() maintenant défini
            String fileUrl = fileUploadService.uploadLabResult(file);

            LabResult labResult = LabResult.builder()
                    .patient(appointment.getPatient())
                    .fileName(file.getOriginalFilename() != null
                            ? file.getOriginalFilename() : "lab-result")
                    .fileUrl(fileUrl)
                    .uploadedAt(LocalDateTime.now())
                    .build();

            labResultRepository.save(labResult);

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload lab result: " + e.getMessage());
        }
    }

    // ===== MARK AS COMPLETED =====
    @Transactional
    public void markAsCompleted(Long appointmentId) {
        Doctor doctor = getAuthenticatedDoctor();

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));

        if (!appointment.getDoctor().getDoctorId().equals(doctor.getDoctorId())) {
            throw new IllegalStateException("Access denied");
        }

        if ("COMPLETED".equals(appointment.getStatus())) {
            throw new IllegalStateException("Appointment already completed");
        }

        appointment.setStatus("COMPLETED");
        appointmentRepository.save(appointment);
    }

    @Transactional(readOnly = true)
    public List<PrescriptionResponse> getPrescriptionHistory(Long appointmentId) {
        Doctor doctor = getAuthenticatedDoctor();
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));
        if (!appointment.getDoctor().getDoctorId().equals(doctor.getDoctorId())) {
            throw new IllegalStateException("Access denied");
        }
        Patient patient = appointment.getPatient();
        return prescriptionRepository.findByPatientOrderByPrescriptionDateDesc(patient)
                .stream()
                .map(p -> new PrescriptionResponse(
                        p.getPrescriptionId(),
                        p.getPrescriptionDate().format(DATE_DISPLAY),
                        p.getDoctor().getClient().getClientName(),
                        p.getDoctor().getDepartment(),
                        p.getDrugs().stream()
                                .map(d -> new DrugResponse(
                                        d.getDrugName(),
                                        d.getDosage(),
                                        d.getFrequency(),
                                        d.getDurationDays() + " jours"
                                ))
                                .toList()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LabResultResponse> getLabResultHistory(Long appointmentId) {
        Doctor doctor = getAuthenticatedDoctor();
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));
        if (!appointment.getDoctor().getDoctorId().equals(doctor.getDoctorId())) {
            throw new IllegalStateException("Access denied");
        }
        Patient patient = appointment.getPatient();
        return labResultRepository.findByPatientOrderByUploadedAtDesc(patient)
                .stream()
                .map(lab -> new LabResultResponse(
                        lab.getLabResultId(),
                        lab.getFileName(),
                        lab.getFileUrl(),
                        lab.getUploadedAt().format(DATETIME_DISPLAY)
                ))
                .toList();
    }
}