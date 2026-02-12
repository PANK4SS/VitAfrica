package com.pankassi.backend.dto.response;

public record AppointmentResponse(
        String date,
        String hour,
        String status,
        String doctorName,
        String doctorDepartment
) {
}
