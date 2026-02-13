package com.pankassi.accesscore.config;

import com.pankassi.accesscore.config.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Configuration CORS pour autoriser Swagger
        CorsConfigurationSource source = request -> new CorsConfiguration().applyPermitDefaultValues();
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.applyPermitDefaultValues();

        http
                .csrf(csrf -> csrf.disable()) // CSRF désactivé pour les APIs REST
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .cors(cors -> cors.configurationSource(source)) // ACTIVER CORS ICI
                .authorizeHttpRequests(auth -> auth
                        // Public Endpoints
                        .requestMatchers("/api/clients/login", "/api/clients/register").permitAll()

                        // Public Mobile Endpoints
                        .requestMatchers("/api/patients/mobile/register").permitAll()
                        .requestMatchers("/api/patients/mobile/login").permitAll()
                        .requestMatchers("/api/patients/mobile/upload-profile-pic").permitAll() // Upload profile picture (for registration)
                        .requestMatchers("/api/patients/mobile/home").permitAll() // Home est publique pour l'instant ? Si tu veux, retire ça.
                        
                        // Public file serving
                        .requestMatchers("/api/files/**").permitAll()

                        // Swagger (Public)
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                        // Tout le reste protégé
                        .anyRequest().authenticated()

                        .requestMatchers("/api/roles/**").hasRole("DEV_ADMIN")
                        .requestMatchers("api/resources").hasRole("DEV_ADMIN")

                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}