package com.pankassi.backend.service;

import com.pankassi.accesscore.domain.model.Client;
import com.pankassi.accesscore.dto.request.ClientRequest;
import com.pankassi.accesscore.dto.request.LoginRequest;
import com.pankassi.accesscore.dto.response.AuthenticationResponse;
import com.pankassi.accesscore.dto.response.ClientResponse;
import com.pankassi.accesscore.service.AuthenticationService;
import com.pankassi.backend.domain.model.Patient;
import com.pankassi.backend.domain.repository.PatientRepository;
import com.pankassi.backend.dto.request.RegisterPatientRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import com.pankassi.accesscore.domain.model.Client;
import com.pankassi.accesscore.domain.repository.ClientRepository;
import com.pankassi.backend.domain.repository.AppointmentRepository;
import com.pankassi.backend.dto.response.MobileHomeResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class PatientService {
    private final PatientRepository patientRepository;
    private final AuthenticationService authenticationService; // Comes from AccessCore

    private final ClientRepository clientRepository;
    private final AppointmentRepository appointmentRepository;

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


    public MobileHomeResponse getMobileHomeInfo() {
        // Collect Conncected user (Email from JWT Token)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("User not authenticated");
        }

        String email = authentication.getName();

        // Find client
        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Find Patient
        Patient patient = patientRepository.findByClient(client)
                .orElseThrow(() -> new IllegalArgumentException("Patient profile not found"));

        // Find Last Appointment
        return appointmentRepository.findFirstByPatientOrderByDateTimeDesc(patient)
                .map(appointment -> {
                    DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMM yyyy", Locale.ENGLISH);
                    DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

                    String formattedDate = appointment.getDateTime().format(dateFormatter);
                    String formattedTime = appointment.getDateTime().format(timeFormatter);

                    return new MobileHomeResponse(
                            client.getClientName(),
                            patient.getProfilePicUrl(),
                            formattedDate,
                            formattedTime,
                            appointment.getStatus(),
                            appointment.getDoctor().getName(),
                            appointment.getDoctor().getDepartment(),
                            List.of(
                                    "Blood Pressure",
                                    "Heart Rate",
                                    "Temperature",
                                    "Weight"
                            )
                    );
                })
                // If there is no appointment
                .orElse(new MobileHomeResponse(
                        client.getClientName(),
                        patient.getProfilePicUrl(),
                        null,
                        null,
                        null,
                        null,
                        null,
                        List.of(
                                "Blood Pressure",
                                "Heart Rate",
                                "Temperature",
                                "Weight"
                        )
                ));
    }

}
