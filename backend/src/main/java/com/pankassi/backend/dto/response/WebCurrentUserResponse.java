package com.pankassi.backend.dto.response;

public record WebCurrentUserResponse(
        String email,
        String clientName,
        String profilePicUrl
) {
}
