package com.pankassi.backend.controller.mobile;

import com.pankassi.accesscore.dto.response.ClientResponse;
import com.pankassi.backend.dto.request.RegisterPatientRequest;
import com.pankassi.backend.service.PatientService;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
