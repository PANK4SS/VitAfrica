package com.pankassi.backend.controller.web;


import com.pankassi.accesscore.dto.request.LoginRequest;
import com.pankassi.accesscore.dto.response.AuthenticationResponse;
import com.pankassi.backend.dto.request.RegisterWebRequest;
import com.pankassi.backend.dto.response.WebCurrentUserResponse;
import com.pankassi.backend.service.WebAuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/api/authentication/web")
@RequiredArgsConstructor
public class WebAuthenticationController {
    private final WebAuthenticationService webAuthenticationService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterWebRequest request) {
        webAuthenticationService.registerWebUser(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Inscription ok. Your account is pending of the Administrator validation");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> loginPatient(@Valid @RequestBody LoginRequest request) {
        AuthenticationResponse response = webAuthenticationService.loginPatient(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<WebCurrentUserResponse> getCurrentUser() {
        return ResponseEntity.ok(webAuthenticationService.getCurrentUser());
    }

}
