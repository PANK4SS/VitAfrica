package com.pankassi.accesscore.dto.response;

public record AuthenticationResponse(
        String accessToken,
        String refreshToken,
        String email,
        String clientName
) {
}
