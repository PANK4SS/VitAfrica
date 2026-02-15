// Response for personnal list (doctor,staff , admin)
// PersonnelResponse.java

package com.pankassi.backend.dto.response.Admin;

public record PersonnelResponse(
        Long clientId,
        String fullName,
        String email,
        String profilePicUrl,
        String role,           // DOCTOR / STAFF / ADMIN
        String status,         // PENDING / APPROVED / REJECTED
        String department      // null if no  Doctor

) {
}
