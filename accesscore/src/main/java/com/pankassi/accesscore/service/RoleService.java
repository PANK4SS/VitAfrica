package com.pankassi.accesscore.service;


import com.pankassi.accesscore.domain.model.Resource;
import com.pankassi.accesscore.domain.model.Role;
import com.pankassi.accesscore.domain.repository.ResourceRepository;
import com.pankassi.accesscore.domain.repository.RoleRepository;
import com.pankassi.accesscore.dto.request.AssignResourcesRequest;
import com.pankassi.accesscore.dto.request.RoleRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashSet;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoleService {
    private final RoleRepository roleRepository;
    private final ResourceRepository resourceRepository;

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

    @Transactional
    public Role assignResources(AssignResourcesRequest request) {
        //Role existence checking and collection
        Role role = roleRepository.findByRoleName(request.roleName().toUpperCase())
                .orElseThrow(() ->
                        new IllegalArgumentException("Role not found: " + request.roleName())
                );

        log.info("Role found: {} with existing resources: {}",
                role.getRoleName(),
                role.getResourceSet().stream()
                        .map(Resource::getResourceName)
                        .toList());


        // Resource Collection
        Set<Resource> newResources = new HashSet<>();
        for (String resourceName : request.resources()) {
            Resource resource = resourceRepository.findByResourceName(resourceName)
                    .orElseThrow(() ->
                            new IllegalArgumentException("Resource not found: " + resourceName)
                    );
            newResources.add(resource);
        }

        // Assignment
        role.getResourceSet().addAll(newResources);

        log.info("After adding resources: {}",
                role.getResourceSet().stream()
                        .map(Resource::getResourceName)
                        .toList());

        return roleRepository.save(role);
    }
}
