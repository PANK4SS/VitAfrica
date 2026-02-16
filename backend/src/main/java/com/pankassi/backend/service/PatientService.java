package com.pankassi.backend.service;

import com.pankassi.accesscore.domain.model.Client;
import com.pankassi.accesscore.dto.request.ClientRequest;
import com.pankassi.accesscore.dto.request.LoginRequest;
import com.pankassi.accesscore.dto.response.AuthenticationResponse;
import com.pankassi.accesscore.dto.response.ClientResponse;
import com.pankassi.accesscore.service.AuthenticationService;
import com.pankassi.backend.domain.model.Appointment;
import com.pankassi.backend.domain.model.Doctor;
import com.pankassi.backend.domain.model.Patient;
import com.pankassi.backend.domain.model.VitalSign;
import com.pankassi.backend.domain.repository.*;
import com.pankassi.backend.dto.request.RegisterPatientRequest;
import com.pankassi.backend.dto.response.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pankassi.accesscore.domain.repository.ClientRepository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class PatientService {
    private final PatientRepository patientRepository;
    private final AuthenticationService authenticationService; // Comes from AccessCore
    private final MedicalPrescriptionRepository prescriptionRepository;

    private final ClientRepository clientRepository;
    private final AppointmentRepository appointmentRepository;
    private final VitalSignRepository vitalSignRepository;

    private final LabResultRepository labResultRepository;
    private final DoctorRepository doctorRepository;

    //Patient Registration
    public ClientResponse registerPatient (RegisterPatientRequest registerPatientRequest,String roleName){
        // Manage registration using AccessCore
        ClientRequest clientRequest = new ClientRequest(
                registerPatientRequest.email(),
                registerPatientRequest.username(),
                registerPatientRequest.password());

        Client newClient = authenticationService.registerClient(clientRequest,roleName);

        // Save data about phone, locationAdress and profilePic
        Patient patient = Patient.builder()
                .phone(registerPatientRequest.phone())
                .locationAddress(registerPatientRequest.locationAddress())
                .profilePicUrl(registerPatientRequest.profilePicUrl())
                .client(newClient).build();

        patientRepository.save(patient);

        return ClientResponse.from(newClient);
    }

    //Login Patient
    public AuthenticationResponse loginPatient(LoginRequest loginRequest){
        return authenticationService.login(loginRequest);
    }

    // Méthode privée utilitaire — à réutiliser dans toutes les méthodes du service
    @Transactional(readOnly = true)
    private Patient getAuthenticatedPatient() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("User not authenticated");
        }

        Client client = clientRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return patientRepository.findByClient(client)
                .orElseThrow(() -> new IllegalArgumentException("Patient profile not found"));
    }

    @Transactional(readOnly = true)
    public MobileHomeResponse getMobileHomeInfo(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("User not authenticated");
        }
        String email = authentication.getName();

        // Client & Patient
        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Patient patient = patientRepository.findByClient(client)
                .orElseThrow(() -> new IllegalArgumentException("Patient profile not found"));

        Doctor doctor = doctorRepository.findByClient(client).orElseThrow(()-> new IllegalArgumentException("Doctor profile not found"));

        // ===== APPOINTMENT =====
        Optional<Appointment> appointmentOpt = appointmentRepository
                .findFirstByPatientAndStatusOrderByDateTimeDesc(patient, "CONFIRMED");

        String date = null, hour = null, appointmentStatus = null;
        String doctorName = null, doctorDepartment = null;

        if (appointmentOpt.isPresent()) {
            Appointment appointment = appointmentOpt.get();
            LocalDateTime dateTime = appointment.getDateTime();

            date              = dateTime.toLocalDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            hour              = dateTime.toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm"));
            appointmentStatus = appointment.getStatus();

            if (appointment.getDoctor() != null) {
                doctorName       = doctor.getClient().getClientName();
                doctorDepartment = doctor.getDepartment();
            }
        }

        // ===== VITAL SIGNS =====
        Optional<VitalSign> vitalSignOpt = vitalSignRepository
                .findFirstByPatientOrderByDateMeasuredDesc(patient);

        String bloodPressure = null, heartRate = null;
        String temperature = null, weight = null, dateMeasured = null;

        if (vitalSignOpt.isPresent()) {
            VitalSign vitalSign = vitalSignOpt.get();

            bloodPressure = vitalSign.getBloodPressure();
            heartRate     = String.valueOf(vitalSign.getHeartRate());
            temperature   = String.valueOf(vitalSign.getTemperature());
            weight        = String.valueOf(vitalSign.getWeight());
            dateMeasured  = vitalSign.getDateMeasured()
                    .format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        }

        // ===== RETURN =====
        return new MobileHomeResponse(
                // PROFILE
                client.getClientName(),
                patient.getProfilePicUrl(),
                // APPOINTMENT
                date,
                hour,
                appointmentStatus,
                doctorName,
                doctorDepartment,
                // VITAL SIGNS
                bloodPressure,
                heartRate,
                temperature,
                weight,
                dateMeasured
        );
    }


    @Transactional(readOnly = true)
    public List<AppointmentResponse> getPatientAppointments() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("User not authenticated");
        }

        Client client = clientRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Patient patient = patientRepository.findByClient(client)
                .orElseThrow(() -> new IllegalArgumentException("Patient profile not found"));

        Doctor doctor = doctorRepository.findByClient(client).orElseThrow(()-> new IllegalArgumentException("Doctor profile not found"));
        String doctorName = doctor.getClient().getClientName();

        List<Appointment> appointments = appointmentRepository
                .findByPatientAndStatusInOrderByDateTimeDesc(
                        patient,
                        List.of("CONFIRMED", "COMPLETED")
                );

        return appointments.stream()
                .map(appointment -> new AppointmentResponse(
                        appointment.getAppointmentId(),
                        appointment.getDateTime().toLocalDate()
                                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd")),
                        appointment.getDateTime().toLocalTime()
                                .format(DateTimeFormatter.ofPattern("HH:mm")),
                        appointment.getStatus(),
                        appointment.getDoctor() != null ? doctorName: null,
                        appointment.getDoctor() != null ? appointment.getDoctor().getDepartment() : null
                ))
                .toList();
    }


    @Transactional(readOnly = true)
    public List<PrescriptionResponse> getPatientPrescriptions() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("User not authenticated");
        }

        Client client = clientRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Patient patient = patientRepository.findByClient(client)
                .orElseThrow(() -> new IllegalArgumentException("Patient profile not found"));

        Doctor doctor = doctorRepository.findByClient(client).orElseThrow(()-> new IllegalArgumentException("Doctor profile not found"));
        String doctorName = doctor.getClient().getClientName();
        return prescriptionRepository
                .findByPatientOrderByPrescriptionDateDesc(patient)
                .stream()
                .map(prescription -> new PrescriptionResponse(
                        prescription.getPrescriptionId(),
                        prescription.getPrescriptionDate()
                                .format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                        doctorName,
                        prescription.getDoctor().getDepartment(),
                        prescription.getDrugs().stream()
                                .map(drug -> new DrugResponse(
                                        drug.getDrugName(),
                                        drug.getDosage(),
                                        drug.getFrequency(),
                                        drug.getDurationDays() + " jours"
                                ))
                                .toList()
                ))
                .toList();
    }


    // ===== LAB RESULTS =====
    @Transactional(readOnly = true)
    public List<LabResultResponse> getPatientLabResults() {
        Patient patient = getAuthenticatedPatient();

        return labResultRepository
                .findByPatientOrderByUploadedAtDesc(patient)
                .stream()
                .map(lab -> new LabResultResponse(
                        lab.getLabResultId(),
                        lab.getFileName(),
                        lab.getFileUrl(),
                        lab.getUploadedAt()
                                .format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
                ))
                .toList();
    }

    // ===== PROFILE =====
    @Transactional(readOnly = true)
    public PatientProfileResponse getPatientProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Patient patient = patientRepository.findByClient(client)
                .orElseThrow(() -> new IllegalArgumentException("Patient profile not found"));

        return new PatientProfileResponse(
                patient.getProfilePicUrl(),
                client.getClientName(),
                client.getEmail(),
                patient.getPhone(),
                patient.getLocationAddress()
        );
    }
}
