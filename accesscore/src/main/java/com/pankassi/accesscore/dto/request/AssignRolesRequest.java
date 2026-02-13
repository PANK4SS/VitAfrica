package com.pankassi.accesscore.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.Set;

public record AssignRolesRequest(
        @NotBlank(message = "The email is required")
        @Email(message = "The email must be valid")
        String email,
        @NotEmpty(message = "At least one role is required")
        Set<String> roles
) {
}
