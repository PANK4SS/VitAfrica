package com.pankassi.backend.dto.response;

public record MobileHomeResponse(
        //===== PROFILE =====
        String userName,
        String profilePic,

        //===== APPOINTMENT =====
        String date,
        String hour,
        String appointmentStatus,
        String doctorName,
        String doctorDepartment,

        //===== VITAL SIGNS =====
        String bloodPressure,
        String heartRate,
        String temperature,
        String weight,
        String dateMeasured
) {}