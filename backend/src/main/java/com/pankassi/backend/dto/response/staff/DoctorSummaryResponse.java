package com.pankassi.backend.dto.response.staff;

public record DoctorSummaryResponse(
        Long doctorId,
        String fullName,
        String department,
        String profilePicUrl
) {
}
