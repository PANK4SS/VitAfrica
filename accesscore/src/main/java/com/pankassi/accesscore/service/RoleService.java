package com.pankassi.accesscore.service;

import com.pankassi.accesscore.domain.model.Role;
import com.pankassi.accesscore.domain.repository.RoleRepository;
import com.pankassi.accesscore.dto.request.RoleRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleService {
    @Autowired
    private final RoleRepository roleRepository;

    public Role createRole(RoleRequest roleRequest){
        // Check if provide role Name already exist
        if(roleRepository.existsByRoleName(roleRequest.name())){
            throw new IllegalStateException("The provided Role Already exists");
        }
        
        String roleName = roleRequest.name().trim().toUpperCase();

        Role role = new Role();
        role.setRoleName(roleName);
        role.setDescription(roleRequest.description());

        return roleRepository.save(role);
    }
}
