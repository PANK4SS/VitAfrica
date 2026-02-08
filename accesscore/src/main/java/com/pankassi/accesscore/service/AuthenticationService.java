package com.pankassi.accesscore.service;

import com.pankassi.accesscore.domain.model.Client;
import com.pankassi.accesscore.domain.repository.ClientRepository;
import com.pankassi.accesscore.domain.repository.RoleRepository;
import com.pankassi.accesscore.dto.request.ClientRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    @Autowired
    private final ClientRepository clientRepository;

    @Autowired
    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    @Value("${app.default.role:USER}")
    private String defaultRole;

    public Client registerClient(ClientRequest clientRequest){
        // Check if the user provide email already exist in DB
        if(clientRepository.existByEmail(clientRequest.email())){
            throw new IllegalStateException("The provided email is already used");
        }
        // At the moment that the provided email don't exist
        Client client = new Client();
        client.setClientName(clientRequest.username());
        client.setEmail(clientRequest.email());
        client.setPassword(passwordEncoder.encode(clientRequest.password())); // Hashed Password

        client.setRoleSet(defaultRole);
    }

}
