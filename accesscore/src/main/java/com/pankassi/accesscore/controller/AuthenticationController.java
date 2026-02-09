package com.pankassi.accesscore.controller;

import com.pankassi.accesscore.domain.model.Client;
import com.pankassi.accesscore.dto.request.ClientRequest;
import com.pankassi.accesscore.dto.response.ClientResponse;
import com.pankassi.accesscore.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/clients")
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    //Registration endpoint
    @PostMapping("/register")
    public ResponseEntity<ClientResponse> registerClient(@Valid @RequestBody ClientRequest clientRequest){
            Client client = authenticationService.registerClient(clientRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(ClientResponse.from(client));
    }
}
