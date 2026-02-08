package com.pankassi.accesscore.dto.request;

import jakarta.validation.constraints.NotBlank;

public record RoleRequest(
        @NotBlank(message = "The Role Name is required")
        String name,
        @NotBlank(message = "The Role description is required")
        String description
) {
}
