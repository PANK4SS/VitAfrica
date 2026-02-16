package com.pankassi.backend.dto.request;

import jakarta.validation.constraints.NotNull;

public record CreateVitalSignRequest(
        @NotNull Long patientId,
        @NotNull String bloodPressure,
        @NotNull Integer heartRate,
        @NotNull Double temperature,
        @NotNull Double weight
) {
}

