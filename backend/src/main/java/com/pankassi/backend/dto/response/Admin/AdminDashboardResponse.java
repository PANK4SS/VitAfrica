package com.pankassi.backend.dto.response.Admin;

public record AdminDashboardResponse(
        long patientNumber,
        long doctorNumber,
        long staffNumber,
        long waitingRequestNumber
) {
}
