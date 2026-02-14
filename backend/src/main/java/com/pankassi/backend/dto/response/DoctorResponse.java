package com.pankassi.backend.dto.response;

public record DoctorResponse(
        String profilePicUrl,
        String name,
        String email
) {
}
