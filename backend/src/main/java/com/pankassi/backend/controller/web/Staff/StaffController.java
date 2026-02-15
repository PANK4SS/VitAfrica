package com.pankassi.backend.controller.web.Staff;

import com.pankassi.backend.dto.request.CreateAppointmentRequest;
// ✅ Import correct — package "staff" en minuscules
import com.pankassi.backend.dto.response.staff.DoctorSummaryResponse;
import com.pankassi.backend.dto.response.staff.PatientSummaryResponse;
import com.pankassi.backend.dto.response.staff.StaffDashboardResponse;
import com.pankassi.backend.service.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STAFF')")
public class StaffController {

    private final StaffService staffService;

    @GetMapping("/dashboard")
    public ResponseEntity<StaffDashboardResponse> getDashboard() {
        return ResponseEntity.ok(staffService.getDashboard());
    }

    @GetMapping("/patients")
    public ResponseEntity<List<PatientSummaryResponse>> getPatients(
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(staffService.getPatients(search));
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorSummaryResponse>> getDoctors() {
        return ResponseEntity.ok(staffService.getDoctors());
    }

    @PostMapping("/appointments")
    public ResponseEntity<Void> createAppointment(
            @Valid @RequestBody CreateAppointmentRequest request) {
        staffService.createAppointment(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}