package com.pankassi.accesscore.config;

import com.pankassi.accesscore.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // 1. Get Authorization Header
        final String authHeader = request.getHeader("Authorization");

        // 2. Check if it starts with "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Extract the token (remove "Bearer ")
        final String jwt = authHeader.substring(7);
        
        // 4. Extract Email from token
        final String userEmail = jwtService.extractEmail(jwt);

        // 5. Extract Roles/Permissions from token (from JwtService)
        final List<SimpleGrantedAuthority> authorities = jwtService.extractAuthorities(jwt);

        // 6. Create Authentication object
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                userEmail,
                null, // Credentials (password) not needed here
                authorities
        );

        authToken.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request)
        );

        // 7. Set Authentication in Security Context
        SecurityContextHolder.getContext().setAuthentication(authToken);

        // 8. Pass to next filter
        filterChain.doFilter(request, response);
    }
}