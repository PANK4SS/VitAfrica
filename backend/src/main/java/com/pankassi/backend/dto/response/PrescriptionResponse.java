package com.pankassi.backend.dto.response;

import java.util.List;

public record PrescriptionResponse(
        Long prescriptionId,
        String date,
        String doctorName,
        String doctorDepartment,
        List<DrugResponse> drugs
) {
}
