package com.pankassi.backend.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record CreateAppointmentRequest(
        @NotNull Long patientId,
        @NotNull Long doctorId,
        @NotNull @Future LocalDateTime dateTime
) {
}
