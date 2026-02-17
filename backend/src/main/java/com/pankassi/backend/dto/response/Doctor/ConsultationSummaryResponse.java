package com.pankassi.backend.dto.response.Doctor;

public record ConsultationSummaryResponse(
        Long appointmentId,
        String patientName,
        String patientPhone,
        String patientProfilePic,
        String date,
        String hour,
        String status
) {
}
