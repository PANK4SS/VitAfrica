// Response for department
// DepartmentResponse.java
package com.pankassi.backend.dto.request;

public record DepartmentResponse(
        Long departmentId,
        String name,
        long doctorCount
) {
}
