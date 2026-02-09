package com.pankassi.accesscore.service;

import com.pankassi.accesscore.domain.model.Client;
import com.pankassi.accesscore.domain.model.RefreshToken;
import com.pankassi.accesscore.domain.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${app.jwt.refresh-expiration}")
    private long refreshExpiration; // en millisecondes

    public RefreshToken createRefreshToken(Client client) {
        // Nettoyer les anciens tokens de cet utilisateur (optionnel, mais propre)
        refreshTokenRepository.deleteByClientClientId(client.getClientId());

        RefreshToken refreshToken = RefreshToken.builder()
                .client(client)
                .token(UUID.randomUUID().toString()) // Génération d'une chaîne aléatoire
                .expiryDate(Instant.now().plusMillis(refreshExpiration))
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token was expired. Please make a new signin request");
        }
        return token;
    }
}