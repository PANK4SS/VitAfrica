package com.pankassi.accesscore.config;

import com.pankassi.accesscore.config.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Enables @PreAuthorize("hasRole('...')")
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF for REST APIs
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Stateless session (JWT)
                .authorizeHttpRequests(auth -> auth
                        // 1. Allow public access to Login and Register endpoints
                        .requestMatchers("/api/clients/login", "/api/clients/register").permitAll()
                        
                        // 2. Allow public access to Backend specific endpoints (Patient Register/Login)
                        .requestMatchers("/api/patients/**/register", "/api/patients/**/login").permitAll()
                        
                        // 3. Allow Swagger UI (for testing)
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                        // 4. Any other request must be authenticated
                        .anyRequest().authenticated()
                )
                // 5. Add our JWT Filter BEFORE the standard UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}