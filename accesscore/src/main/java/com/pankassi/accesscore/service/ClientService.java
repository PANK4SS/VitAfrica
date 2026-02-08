package com.pankassi.accesscore.service;

import com.pankassi.accesscore.domain.model.Client;
import com.pankassi.accesscore.domain.model.Role;
import com.pankassi.accesscore.domain.repository.ClientRepository;
import com.pankassi.accesscore.domain.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ClientService {
    private final ClientRepository clientRepository;
    private final RoleRepository roleRepository;

    public Client assignRoles(String email, Set<String> roleNames) {

        //Collect existing Clien using the provided mail
        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("Client not found: " + email)
                );

        // Check if all provided roles exists : if only one in the list don't exist, stop request
        Set<Role> roles = new HashSet<>();

        for (String roleName : roleNames) {
            Role role = roleRepository.findByRoleName(roleName.toUpperCase())
                    .orElseThrow(() ->
                            new IllegalArgumentException("Role not found: " + roleName)
                    );
            roles.add(role);
        }

        // Assign the roles to the existing client
        client.getRoleSet().addAll(roles);

        // Save
        return clientRepository.save(client);
    }
}
