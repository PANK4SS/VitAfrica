package com.pankassi.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ApproveRequestBody(
        @NotBlank(message = "Role is required")
        String role,           // "DOCTOR" ou "STAFF" ou "ADMIN"

        String department      // required if role = DOCTOR
) {
}
