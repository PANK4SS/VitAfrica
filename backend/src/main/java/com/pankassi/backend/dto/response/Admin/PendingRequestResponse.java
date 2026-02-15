// Response for pending request
// PendingRequestResponse.java
package com.pankassi.backend.dto.response.Admin;

public record PendingRequestResponse(
        Long profileId,
        String fullName,
        String email,
        String profilePicUrl,
        String status
) {
}
