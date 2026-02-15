package com.pankassi.backend.dto.response.staff;

public record PatientSummaryResponse(
        Long patientId,
        String fullName,
        String phone,
        String locationAddress,
        String profilePicUrl
) {
}
