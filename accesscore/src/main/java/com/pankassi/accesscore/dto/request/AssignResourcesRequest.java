package com.pankassi.accesscore.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.Set;

public record AssignResourcesRequest(
        @NotBlank(message = "The role name is required")
        String roleName,
        @NotEmpty(message = "At least one resource is required!")
        Set<String> resources
) {
}
