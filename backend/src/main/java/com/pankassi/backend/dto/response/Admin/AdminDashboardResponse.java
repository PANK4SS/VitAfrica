package com.pankassi.backend.dto.response.Admin;

public record AdminDashboardResponse(
        Integer patientNumber,
        Integer doctorNumber,
        Integer staffNumber,
        Integer waitingRequestNumber
) {
}
