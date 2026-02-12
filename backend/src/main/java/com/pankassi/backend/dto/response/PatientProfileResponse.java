package com.pankassi.backend.dto.response;

public record PatientProfileResponse(
        String profilePicUrl,
        String name,
        String email,
        String phone,
        String locationAddress
) {
}
