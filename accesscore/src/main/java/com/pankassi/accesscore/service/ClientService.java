package com.pankassi.accesscore.service;

import com.pankassi.accesscore.domain.model.Client;
import com.pankassi.accesscore.domain.model.Role;
import com.pankassi.accesscore.domain.repository.ClientRepository;
import com.pankassi.accesscore.domain.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Slf4j  //  logger ADDED
@Service
@RequiredArgsConstructor
public class ClientService {
    private final ClientRepository clientRepository;
    private final RoleRepository roleRepository;

    @Transactional  // Persistence
    public Client assignRoles(String email, Set<String> roleNames) {

        // Collect existing Client using the provided email
        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("Client not found: " + email)
                );

        log.info("Client found: {} with existing roles: {}",
                client.getEmail(),
                client.getRoleSet().stream()
                        .map(Role::getRoleName)
                        .toList());

        // Check if all provided roles exist
        Set<Role> newRoles = new HashSet<>();
        for (String roleName : roleNames) {
            Role role = roleRepository.findByRoleName(roleName.toUpperCase())
                    .orElseThrow(() ->
                            new IllegalArgumentException("Role not found: " + roleName)
                    );
            newRoles.add(role);
        }

        // Add the new roles to existing ones (not replace!)
        client.getRoleSet().addAll(newRoles);

        log.info("After adding roles: {}",
                client.getRoleSet().stream()
                        .map(Role::getRoleName)
                        .toList());

        // Save
        return clientRepository.save(client);
    }
}