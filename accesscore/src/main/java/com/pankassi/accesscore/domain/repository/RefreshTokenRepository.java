package com.pankassi.accesscore.domain.repository;

import com.pankassi.accesscore.domain.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken,Long> {
    Optional<RefreshToken> findByToken(String token);

    // Delete all tokens from a client (useful when reconnecting to prevent proliferation)
    @Modifying
    @Transactional
    void deleteByClientId(Long clientId);
}
