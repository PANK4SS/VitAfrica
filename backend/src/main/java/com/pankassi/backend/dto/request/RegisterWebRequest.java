package com.pankassi.backend.dto.response;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterWebRequest(
        @NotBlank(message = "The mail is required")
        @Email(message = "Provide a correct email")
        String email,
        @NotBlank(message = "The username is required")
        String username,
        @NotBlank(message = "The password is required")
        @Size(min = 8, message = "The provided password must contain at least 8 characters")
        String password,
        @NotBlank(message = "Profile pic url is required")
        String profilePicUrl
) {
}
