package com.pankassi.backend.config;

import com.pankassi.accesscore.config.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity   // ✅ Active @PreAuthorize dans les controllers
@RequiredArgsConstructor
public class VitAfricaSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    @Order(2)  // ✅ S'exécute APRÈS AccessCoreSecurityConfig (order=1)
    public SecurityFilterChain vitAfricaFilterChain(HttpSecurity http) throws Exception {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:*",
                "https://*.vercel.app",
                "http://*.vercel.app",
                "https://vitafrica-production.up.railway.app"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        http
                .securityMatcher("/api/**")  // ✅ Capture tout le reste
                .csrf(csrf -> csrf.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .cors(cors -> cors.configurationSource(source))
                .authorizeHttpRequests(auth -> auth

                        // ===== PUBLIC MOBILE =====
                        .requestMatchers(
                                "/api/patients/mobile/login",
                                "/api/patients/mobile/register",
                                "/api/patients/mobile/upload-profile-pic"
                        ).permitAll()

                        // ===== PUBLIC WEB =====
                        .requestMatchers(
                                "/api/authentication/web/login",
                                "/api/authentication/web/register"
                        ).permitAll()

                        // ===== FICHIERS =====
                        .requestMatchers("/api/files/**").permitAll()

                        // ===== SWAGGER =====
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                        // ===== TOUT LE RESTE PROTÉGÉ =====
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}