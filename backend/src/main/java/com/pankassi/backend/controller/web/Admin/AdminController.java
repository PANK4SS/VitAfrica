package com.pankassi.backend.controller.web.Admin;

import com.pankassi.backend.dto.response.Admin.AdminDashboardResponse;
import com.pankassi.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final AdminService adminService;

    /**
     * Endpoint for dashboard metrics collecting.
     */
    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardResponse> getDashboardStats() {
        AdminDashboardResponse stats = adminService.usersStats();
        return ResponseEntity.ok(stats);
    }
}
