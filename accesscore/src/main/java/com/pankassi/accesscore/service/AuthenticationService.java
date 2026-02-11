package com.pankassi.accesscore.service;

import com.pankassi.accesscore.domain.model.Client;
import com.pankassi.accesscore.domain.model.RefreshToken;
import com.pankassi.accesscore.domain.model.Role;
import com.pankassi.accesscore.domain.repository.ClientRepository;
import com.pankassi.accesscore.domain.repository.RoleRepository;
import com.pankassi.accesscore.dto.request.ClientRequest;
import com.pankassi.accesscore.dto.request.LoginRequest;
import com.pankassi.accesscore.dto.response.AuthenticationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final ClientRepository clientRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    @Value("${app.default.role:USER}")
    private String defaultRoleName;

    public Client registerClient(ClientRequest clientRequest){
        // Check if the user provide email already exist in DB
        if(clientRepository.existsByEmail(clientRequest.email())){
            throw new IllegalStateException("The provided email is already used");
        }
        //Collect default role by usign default role name
        Role role = roleRepository.findByRoleName(defaultRoleName)
                .orElseThrow(() -> new IllegalStateException(
                        "Default role not found: " + defaultRoleName
                ));

        // At the moment that the provided email don't exist
        Client client = new Client();
        client.setClientName(clientRequest.username());
        client.setEmail(clientRequest.email());
        client.setPassword(passwordEncoder.encode(clientRequest.password())); // Hashed Password
        client.setRoleSet(Set.of(role));

        return clientRepository.save(client);
    }

    public Client registerClient(ClientRequest clientRequest, String specificRoleName){
        
        // Role to use decision : parameter's role or default role
        String roleNameToUse = (specificRoleName != null) ? specificRoleName : defaultRoleName;

        if(clientRepository.existsByEmail(clientRequest.email())){
            throw new IllegalStateException("The provided email is already used");
        }

        // Specific role searching (ex: "PATIENT", "ADMIN")
        Role role = roleRepository.findByRoleName(roleNameToUse)
                .orElseThrow(() -> new IllegalStateException(
                        "Role not found: " + roleNameToUse
                ));

        Client client = new Client();
        client.setClientName(clientRequest.username());
        client.setEmail(clientRequest.email());
        client.setPassword(passwordEncoder.encode(clientRequest.password()));
        client.setRoleSet(Set.of(role));

        return clientRepository.save(client);
    }


    public AuthenticationResponse login(LoginRequest request) {
        // 1. Trouver le client
        Client client = clientRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        // 2. Vérifier le mot de passe
        if (!passwordEncoder.matches(request.password(), client.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        // 3. Générer l'Access Token
        String accessToken = jwtService.generateToken(client);

        // 4. Générer le Refresh Token
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(client);

        // 5. Construire la réponse (CORRECTION ICI : utiliser le constructeur standard)
        return new AuthenticationResponse(
                accessToken,
                refreshToken.getToken(),
                client.getEmail(),
                client.getClientName()
        );
    }


}
