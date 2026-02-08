package com.pankassi.accesscore.dto.response;

public record RoleResponse(
        Long roleId,
        String roleName,
        String roleDescription
) {
}
