package com.pankassi.backend.controller.web.Doctor;

import com.pankassi.backend.dto.request.AddPrescriptionRequest;
import com.pankassi.backend.dto.response.Doctor.*;
import com.pankassi.backend.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
@PreAuthorize("hasRole('DOCTOR')")
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping("/dashboard")
    public ResponseEntity<DoctorDashboardResponse> getDashboard() {
        return ResponseEntity.ok(doctorService.getDashboard());
    }

    @GetMapping("/consultations")
    public ResponseEntity<List<ConsultationSummaryResponse>> getConsultations() {
        return ResponseEntity.ok(doctorService.getConsultations());
    }

    @GetMapping("/consultations/{appointmentId}")
    public ResponseEntity<ConsultationDetailResponse> getConsultationDetail(
            @PathVariable Long appointmentId) {
        return ResponseEntity.ok(doctorService.getConsultationDetail(appointmentId));
    }

    @PostMapping("/consultations/{appointmentId}/prescription")
    public ResponseEntity<Void> addPrescription(
            @PathVariable Long appointmentId,
            @Valid @RequestBody AddPrescriptionRequest request) {
        doctorService.addPrescription(appointmentId, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/consultations/{appointmentId}/lab-result")
    public ResponseEntity<Void> uploadLabResult(
            @PathVariable Long appointmentId,
            @RequestParam("file") MultipartFile file) {
        doctorService.uploadLabResult(appointmentId, file);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/consultations/{appointmentId}/complete")
    public ResponseEntity<Void> markAsCompleted(@PathVariable Long appointmentId) {
        doctorService.markAsCompleted(appointmentId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/consultations/{appointmentId}/prescriptions")
    public ResponseEntity<List<com.pankassi.backend.dto.response.PrescriptionResponse>> getPrescriptionHistory(
            @PathVariable Long appointmentId) {
        return ResponseEntity.ok(doctorService.getPrescriptionHistory(appointmentId));
    }

    @GetMapping("/consultations/{appointmentId}/lab-results")
    public ResponseEntity<List<com.pankassi.backend.dto.response.LabResultResponse>> getLabResultHistory(
            @PathVariable Long appointmentId) {
        return ResponseEntity.ok(doctorService.getLabResultHistory(appointmentId));
    }
}
