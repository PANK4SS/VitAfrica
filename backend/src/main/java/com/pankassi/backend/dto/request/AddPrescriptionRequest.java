package com.pankassi.backend.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record AddPrescriptionRequest(
        @NotNull Long patientId,
        @NotEmpty List<DrugRequest> drugs
) {
}
