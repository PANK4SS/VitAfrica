package com.pankassi.accesscore.dto.response;

import com.pankassi.accesscore.domain.model.Role;

public record RoleResponse(
        Long roleId,
        String roleName,
        String roleDescription
) {
    //Convert role into RoleResponse
    public static RoleResponse from(Role role){
        return new RoleResponse(
                role.getRoleId(),
                role.getRoleName(),
                role.getDescription()
        );
    }
}
