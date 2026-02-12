package com.pankassi.backend.controller.mobile;

import com.pankassi.accesscore.dto.request.LoginRequest;
import com.pankassi.accesscore.dto.response.AuthenticationResponse;
import com.pankassi.accesscore.dto.response.ClientResponse;
import com.pankassi.backend.dto.request.RegisterPatientRequest;
import com.pankassi.backend.dto.response.AppointmentResponse;
import com.pankassi.backend.dto.response.MobileHomeResponse;
import com.pankassi.backend.service.PatientService;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients/mobile")
@RequiredArgsConstructor
public class PatientController {
    private final PatientService patientService;

    @PostMapping("/register")
    public ResponseEntity<ClientResponse> registerPatient(@Valid @RequestBody RegisterPatientRequest request) {
        ClientResponse response = patientService.registerPatient(request,"PATIENT");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> loginPatient(@Valid @RequestBody LoginRequest request) {
        AuthenticationResponse response = patientService.loginPatient(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/home")
    @PreAuthorize("hasRole('PATIENT')") // Only Patient can see that data
    public ResponseEntity<MobileHomeResponse> getHome() {
        MobileHomeResponse homeInfo = patientService.getMobileHomeInfo();
        return ResponseEntity.ok(homeInfo);
    }

    @GetMapping("/appointments")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<AppointmentResponse>> getAppointments() {
        return ResponseEntity.ok(patientService.getPatientAppointments());
    }
}
