package com.pankassi.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterPatientRequest(

        // --- Authentication Fields for AccessCore ---
        @NotBlank(message = "Username is required")
        String username,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @NotBlank(message = "Password is required")
        String password,

        // --- Patient Fields for backend ---
        @NotBlank(message = "Phone is required")
        String phone,

        @NotBlank(message = "Address is required")
        String locationAddress,

        @NotBlank(message = "Profile pic URL is required")
        String profilePicUrl
) {}