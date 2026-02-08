package com.pankassi.accesscore.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ClientRequest(
        @NotBlank(message = "The email is required")
        @Email(message = "The Email must be an valide one")
        String email,
        @NotBlank(message = "The username is required")
        String username,
        @NotBlank(message="The password is required")
        @Size(min = 8 , message = "Password must have at least 8 characters")
        String password
) {
}
