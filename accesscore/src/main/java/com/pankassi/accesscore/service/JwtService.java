package com.pankassi.accesscore.service;

import com.pankassi.accesscore.domain.model.Client;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.Key;
import java.util.Date;
import java.util.HashSet;
import java.util.List; 
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JwtService {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration}")
    private long jwtExpiration;

    // Génération de la clé de signature
    private Key getSigningKey() {
        byte[] keyBytes = normalizeSecret(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Ensure at least 256-bit key material even if environment secret is short.
     * This prevents runtime WeakKeyException during token generation.
     */
    private byte[] normalizeSecret(String rawSecret) {
        String safeSecret = rawSecret != null ? rawSecret : "";
        byte[] original = safeSecret.getBytes(StandardCharsets.UTF_8);

        if (original.length >= 32) {
            return original;
        }

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return digest.digest(original);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("Unable to initialize JWT signing key", e);
        }
    }

    public String generateToken(Client client) {
        // Construction des "authorities" Spring Security
        // Format attendu: ROLE_... pour les rôles, et le nom de la ressource pour les permissions
        Set<String> authorities = new HashSet<>();

        // 1. Ajouter les rôles (ex: "ROLE_USER", "ROLE_TEACHER")
        client.getRoleSet().forEach(role -> {
            authorities.add("ROLE_" + role.getRoleName());

            // 2. Ajouter les ressources du rôle (ex: "BOOK_CREATE", "BOOK_DELETE")
            if (role.getResourceSet() != null) {
                Set<String> resourceNames = role.getResourceSet().stream()
                        .map(resource -> resource.getResourceName())
                        .collect(Collectors.toSet());
                authorities.addAll(resourceNames);
            }
        });

        return Jwts.builder()
                .setSubject(client.getEmail())
                .claim("authorities", authorities) // On met les permissions dans le payload
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean isTokenValid(String token, Client client) {
        try {
            String email = extractEmail(token);
            return (email.equals(client.getEmail()) && !isTokenExpired(token));
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
    }


    // Méthode utilitaire pour extraire les rôles/permissions (authorities) depuis le token
    @SuppressWarnings("unchecked")
    public List<SimpleGrantedAuthority> extractAuthorities(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        
        List<String> authorities = (List<String>) claims.get("authorities");
        
        return authorities.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }
}
