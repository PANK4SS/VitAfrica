package com.pankassi.backend.controller.web.Admin;

import com.pankassi.backend.dto.request.ApproveRequestBody;
import com.pankassi.backend.dto.request.DepartmentResponse;
import com.pankassi.backend.dto.response.Admin.*;
import com.pankassi.backend.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    // ===== DASHBOARD =====
    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardResponse> getDashboardStats() {
        return ResponseEntity.ok(adminService.usersStats());
    }

    // ===== REGISTRATION REQUESTS =====
    @GetMapping("/requests")
    public ResponseEntity<List<PendingRequestResponse>> getPendingRequests() {
        return ResponseEntity.ok(adminService.getPendingRequests());
    }

    @PostMapping("/requests/{profileId}/approve")
    public ResponseEntity<Void> approveRequest(
            @PathVariable Long profileId,
            @Valid @RequestBody ApproveRequestBody body) {
        adminService.approveRequest(profileId, body);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/requests/{profileId}/reject")
    public ResponseEntity<Void> rejectRequest(@PathVariable Long profileId) {
        adminService.rejectRequest(profileId);
        return ResponseEntity.ok().build();
    }

    // ===== PERSONNEL =====
    @GetMapping("/personnel")
    public ResponseEntity<List<PersonnelResponse>> getPersonnel(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(adminService.getPersonnel(role, search));
    }

    // ===== DEPARTMENTS =====
    @GetMapping("/departments")
    public ResponseEntity<List<DepartmentResponse>> getDepartments() {
        return ResponseEntity.ok(adminService.getDepartments());
    }

    @PostMapping("/departments")
    public ResponseEntity<Void> addDepartment(@RequestBody Map<String, String> body) {
        adminService.addDepartment(body.get("name"));
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/departments/{departmentId}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable Long departmentId) {
        adminService.deleteDepartment(departmentId);
        return ResponseEntity.noContent().build();
    }
}