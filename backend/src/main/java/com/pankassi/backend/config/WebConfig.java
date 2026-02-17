package com.pankassi.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    /**
     * CORS global (MVC) : appliqué avant Security pour que les preflight OPTIONS
     * reçoivent toujours les en-têtes. Permet localhost (dev), Vercel (prod front) et Railway.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns(
                        "http://localhost:*",
                        "https://*.vercel.app",
                        "http://*.vercel.app",
                        "https://vitafrica-production.up.railway.app"
                )
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With")
                .allowCredentials(true)
                .maxAge(3600);
    }

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
