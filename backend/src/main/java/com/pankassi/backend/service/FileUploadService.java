package com.pankassi.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Slf4j
public class FileUploadService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    // Public base URL of the backend used to build file URLs.
    // In production on Railway, this should point to the HTTPS edge URL.
    // You can override it with the `app.base.url` property if needed.
    @Value("${app.base.url:https://vitafrica-production.up.railway.app}")
    private String baseUrl;

    /**
     * Upload a profile picture and return the public URL
     * @param file MultipartFile to upload
     * @return Public URL to access the uploaded file
     * @throws IOException if file cannot be saved
     */
    public String uploadProfilePicture(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Validate file type
        String contentType = file.getContentType();
        String originalFilename = file.getOriginalFilename();
        boolean isImageByContentType = contentType != null && contentType.startsWith("image/");
        boolean isImageByExtension = hasImageExtension(originalFilename);
        if (!isImageByContentType && !isImageByExtension) {
            throw new IllegalArgumentException("File must be an image");
        }

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir, "profile-pictures");
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String uniqueFilename = UUID.randomUUID().toString() + extension;

        // Save file
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        log.info("Profile picture uploaded: {}", filePath);

        // Return public URL
        String publicUrl = baseUrl + "/api/files/profile-pictures/" + uniqueFilename;
        return publicUrl;
    }

    private boolean hasImageExtension(String filename) {
        if (filename == null || !filename.contains(".")) return false;
        String extension = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
        return extension.equals("jpg")
                || extension.equals("jpeg")
                || extension.equals("png")
                || extension.equals("webp")
                || extension.equals("gif")
                || extension.equals("heic")
                || extension.equals("heif");
    }

    /**
     * Delete a profile picture file
     * @param filename Filename to delete
     * @return true if deleted successfully, false otherwise
     */
    public boolean deleteProfilePicture(String filename) {
        try {
            Path filePath = Paths.get(uploadDir, "profile-pictures", filename);
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("Profile picture deleted: {}", filePath);
                return true;
            }
            return false;
        } catch (IOException e) {
            log.error("Error deleting profile picture: {}", filename, e);
            return false;
        }
    }


    // Ajoute cette méthode dans FileUploadService.java
    public String uploadLabResult(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Accepte PDF et images
        String contentType = file.getContentType();
        if (contentType == null ||
                (!contentType.equals("application/pdf") && !contentType.startsWith("image/"))) {
            throw new IllegalArgumentException("File must be a PDF or an image");
        }

        Path uploadPath = Paths.get(uploadDir, "lab-results");
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String uniqueFilename = UUID.randomUUID().toString() + extension;

        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        log.info("Lab result uploaded: {}", filePath);

        return baseUrl + "/api/files/lab-results/" + uniqueFilename;
    }
}
