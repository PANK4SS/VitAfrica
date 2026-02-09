package com.pankassi.accesscore.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ResourceRequest(
        @NotBlank(message = "The Resource Name is required")
        String name,
        @NotBlank(message = "The Resource description is required")
        String description
) {
}
