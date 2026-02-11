package com.pankassi.backend.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public record MobileHomeResponse(
        String userName,
        String profilePic,
        String date,   // The appointment date
        String hour,   // The appointment hour
        String appointmentStatus,
        String doctorName,
        String doctorDepartment,
        List<String> vitalSignsConstants
) {}