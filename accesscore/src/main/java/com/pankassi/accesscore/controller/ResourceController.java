package com.pankassi.accesscore.controller;

import com.pankassi.accesscore.domain.model.Resource;
import com.pankassi.accesscore.dto.request.ResourceRequest;
import com.pankassi.accesscore.dto.response.ResourceResponse;
import com.pankassi.accesscore.dto.response.RoleResponse;
import com.pankassi.accesscore.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {
    private final ResourceService resourceService;

    // Endpoint to create a role
    @PostMapping
    public ResponseEntity<ResourceResponse> createResource(@Valid @RequestBody ResourceRequest resourceRequest){
        Resource resource = resourceService.createResource(resourceRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(ResourceResponse.from(resource));
    }
}
