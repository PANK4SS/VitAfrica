package com.pankassi.accesscore.service;

import com.pankassi.accesscore.domain.repository.ClientRepository;
import com.pankassi.accesscore.domain.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Value("${app.default.role:USER}")
    private String defaultRole;
}
