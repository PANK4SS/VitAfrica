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
import com.pankassi.backend.domain.repository.PatientRepository;
import com.pankassi.backend.dto.request.RegisterPatientRequest;
import com.pankassi.backend.dto.response.MobileHomeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.pankassi.accesscore.domain.repository.ClientRepository;
import com.pankassi.backend.domain.repository.AppointmentRepository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;


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

    public MobileHomeResponse getMobileHomeInfo(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();//Collect connected user representing object

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("User not authenticated");
        }
        String email = authentication.getName();

        //Client Extracting (will be use for Username collection)
        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        //Patient Extracting (will be use dor profilePic collection)
        Patient patient = patientRepository.findByClient(client)
                .orElseThrow(() -> new IllegalArgumentException("Patient profile not found"));

        //Latest Appointment
        Optional<Appointment> appointmentOpt = appointmentRepository.findFirstByPatientAndStatusOrderByDateTimeDesc(patient, "CONFIRMED");
        String date = null;
        String hour = null;
        String appointmentStatus = null;
        String doctorName = null;
        String doctorDepartment = null;
        if (appointmentOpt.isPresent()) {
            Appointment appointment = appointmentOpt.get();

            LocalDateTime dateTime = appointment.getDateTime();
            date = dateTime.toLocalDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            hour = dateTime.toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm")); //"HH:mm" for 24h format or "hh:mm a" for 12h format


            appointmentStatus = appointment.getStatus();

            if (appointment.getDoctor() != null) {
                Doctor doctor = appointment.getDoctor();
                doctorName = doctor.getName(); // ou getFirstName() + getLastName() selon votre modèle
                doctorDepartment = doctor.getDepartment(); // selon votre modèle Doctor
            }
        }


        //Latest Vital Constant
    }
}
