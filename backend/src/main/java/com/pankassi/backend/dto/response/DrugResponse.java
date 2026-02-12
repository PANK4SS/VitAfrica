package com.pankassi.backend.dto.response;

public record DrugResponse(
        String drugName,
        String dosage,
        String frequency,
        String durationDays
) {
}
