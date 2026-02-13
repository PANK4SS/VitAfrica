package com.pankassi.backend.dto.response;

public record AppointmentResponse(
        Long appointmentId,
        String date,
        String hour,
        String status,
        String doctorName,
        String doctorDepartment
) {
}
