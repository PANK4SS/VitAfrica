package com.pankassi.accesscore.dto.response;

import java.util.Set;

public record ClientResponse(
    String clientName,
    String clientEmail,
    Set<String> roles
) {
}
