package com.pankassi.accesscore.service;

import com.pankassi.accesscore.domain.model.Resource;
import com.pankassi.accesscore.domain.model.Role;
import com.pankassi.accesscore.domain.repository.ResourceRepository;
import com.pankassi.accesscore.dto.request.ResourceRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ResourceService {
    private final ResourceRepository resourceRepository;

    public Resource createResource(ResourceRequest resourceRequest){
        // Check if provide resource Name already exist
        if(resourceRepository.existsByResourceName(resourceRequest.name())){
            throw new IllegalStateException("The provided Resource Already exists");
        }

        String resourceName = resourceRequest.name().trim().toUpperCase();

        Resource resource = new Resource();
        resource.setResourceName(resourceName);
        resource.setResourceDescription(resourceRequest.description());

        return resourceRepository.save(resource);
    }

}
