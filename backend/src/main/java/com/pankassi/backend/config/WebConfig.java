package com.pankassi.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve uploaded profile pictures
        String uploadPath = Paths.get(uploadDir, "profile-pictures").toAbsolutePath().toString();
        registry.addResourceHandler("/api/files/profile-pictures/**")
                .addResourceLocations("file:" + uploadPath + "/");

        // Serve uploaded lab results
        String labResultsPath = Paths.get(uploadDir, "lab-results").toAbsolutePath().toString();
        registry.addResourceHandler("/api/files/lab-results/**")
                .addResourceLocations("file:" + labResultsPath + "/");
    }
}
