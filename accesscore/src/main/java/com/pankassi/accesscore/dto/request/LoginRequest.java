package com.pankassi.accesscore.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "The Email is required")
        @Email(message = "The provided Email should be a valid one")
        String email,

        @NotBlank(message = "The Password is required")
        String password
) {
}
