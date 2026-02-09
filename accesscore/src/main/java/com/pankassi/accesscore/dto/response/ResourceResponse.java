package com.pankassi.accesscore.dto.response;


import com.pankassi.accesscore.domain.model.Resource;

public record ResourceResponse(
        Long resourceId,
        String resourceName,
        String resourceDescription
) {
    //Convert resource into RoleResponse
    public static ResourceResponse from(Resource resource){
        return new ResourceResponse(
                resource.getResourceId(),
                resource.getResourceName(),
                resource.getResourceDescription()
        );
    }
}
