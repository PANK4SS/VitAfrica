package com.pankassi.backend.dto.response;

public record LabResultResponse(
        Long labResultId,
        String fileName,
        String fileUrl,
        String uploadedAt
) {
}
