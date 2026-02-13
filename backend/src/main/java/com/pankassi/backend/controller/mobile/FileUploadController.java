package com.pankassi.backend.controller.mobile;

import com.pankassi.backend.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/patients/mobile")
@RequiredArgsConstructor
@Slf4j
public class FileUploadController {

    private final FileUploadService fileUploadService;

    /**
     * Upload profile picture endpoint
     * POST /api/patients/mobile/upload-profile-pic
     * No authentication required (for registration flow)
     */
    @PostMapping("/upload-profile-pic")
    public ResponseEntity<Map<String, String>> uploadProfilePicture(
            @RequestParam("file") MultipartFile file) {
        try {
            String publicUrl = fileUploadService.uploadProfilePicture(file);
            
            Map<String, String> response = new HashMap<>();
            response.put("url", publicUrl);
            response.put("message", "Profile picture uploaded successfully");
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Invalid file upload request: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            log.error("Error uploading profile picture", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to upload profile picture: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
