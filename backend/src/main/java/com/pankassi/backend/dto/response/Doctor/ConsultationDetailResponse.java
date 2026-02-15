package com.pankassi.backend.dto.response.Doctor;

public record ConsultationDetailResponse(
        Long appointmentId,
        String patientName,
        String patientPhone,
        String patientLocation,
        String patientProfilePic,
        String date,
        String hour,
        String status
) {
}
