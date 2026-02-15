package com.pankassi.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DrugRequest(
        @NotBlank String drugName,
        @NotBlank String dosage,
        @NotBlank String frequency,
        @NotNull Integer durationDays
) {
}
