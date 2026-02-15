package com.pankassi.backend.dto.response.Doctor;

public record DoctorDashboardResponse(
        long upcomingConsultations,
        long completedConsultations
) {
}
