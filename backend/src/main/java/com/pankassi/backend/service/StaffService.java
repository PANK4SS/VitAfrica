package com.pankassi.backend.service;

import com.pankassi.accesscore.domain.repository.ClientRepository;
import com.pankassi.backend.domain.model.*;
import com.pankassi.backend.domain.repository.*;
import com.pankassi.backend.dto.request.CreateAppointmentRequest;
// ✅ Import correct — package "staff" en minuscules
import com.pankassi.backend.dto.response.staff.DoctorSummaryResponse;
import com.pankassi.backend.dto.response.staff.PatientSummaryResponse;
import com.pankassi.backend.dto.response.staff.StaffDashboardResponse;
import com.pankassi.backend.domain.repository.web.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final ClientRepository clientRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserProfileRepository userProfileRepository;

    // ===== DASHBOARD =====
    @Transactional(readOnly = true)
    public StaffDashboardResponse getDashboard() {
        return new StaffDashboardResponse(patientRepository.count());
    }

    // ===== PATIENTS =====
    @Transactional(readOnly = true)
    public List<PatientSummaryResponse> getPatients(String search) {
        List<Patient> patients = (search != null && !search.isBlank())
                ? patientRepository.searchByNameOrPhone(search)
                : patientRepository.findAll();

        return patients.stream()
                .map(p -> new PatientSummaryResponse(
                        p.getPatientId(),
                        p.getClient().getClientName(),
                        p.getPhone(),
                        p.getLocationAddress(),
                        p.getProfilePicUrl()
                ))
                .toList();
    }

    // ===== DOCTORS — pour le form appointment =====
    @Transactional(readOnly = true)
    public List<DoctorSummaryResponse> getDoctors() {
        return doctorRepository.findAllByOrderByDepartmentAsc()
                .stream()
                .map(d -> new DoctorSummaryResponse(
                        d.getDoctorId(),
                        d.getClient().getClientName(),
                        d.getDepartment(),
                        userProfileRepository.findByClientClientId(d.getClient().getClientId())
                                .map(UserProfile::getProfilePicUrl)
                                .orElse(null)
                ))
                .toList();
    }

    // ===== CREATE APPOINTMENT =====
    @Transactional
    public void createAppointment(CreateAppointmentRequest request) {
        Patient patient = patientRepository.findById(request.patientId())
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));

        Doctor doctor = doctorRepository.findById(request.doctorId())
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .dateTime(request.dateTime())
                .status("CONFIRMED")
                .build();

        appointmentRepository.save(appointment);
    }
}
