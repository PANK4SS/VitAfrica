package com.pankassi.accesscore.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class AccessCoreSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * ✅ VERSION DEV — Tout est ouvert pour créer admins/roles librement
     * Activer avec : app.security.dev-mode=true dans application.properties
     */
    @Bean
    @Order(1)
    @ConditionalOnProperty(name = "app.security.dev-mode", havingValue = "true")
    public SecurityFilterChain devFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/api/clients/**", "/api/roles/**", "/api/resources/**")
                .csrf(csrf -> csrf.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // ✅ Tout ouvert en dev
                );
        return http.build();
    }

    /**
     * ✅ VERSION PROD — Routes AccessCore protégées
     * Activer avec : app.security.dev-mode=false (ou absent)
     */
    @Bean
    @Order(1)
    @ConditionalOnProperty(
            name = "app.security.dev-mode",
            havingValue = "false",
            matchIfMissing = true
    )
    public SecurityFilterChain accessCoreFilterChain(HttpSecurity http) throws Exception {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "https://vitafrica-production.up.railway.app"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        http
                .securityMatcher("/api/clients/**", "/api/roles/**", "/api/resources/**")
                .csrf(csrf -> csrf.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .cors(cors -> cors.configurationSource(source))
                .authorizeHttpRequests(auth -> auth
                        // Public
                        .requestMatchers("/api/clients/login", "/api/clients/register").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        // Gestion roles/resources → DEV_ADMIN seulement
                        .requestMatchers("/api/roles/**").hasRole("DEV_ADMIN")
                        .requestMatchers("/api/resources/**").hasRole("DEV_ADMIN")
                        .requestMatchers("/api/clients/*/roles").hasRole("DEV_ADMIN")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}