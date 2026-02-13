package com.pankassi.accesscore.domain.repository;

import com.pankassi.accesscore.domain.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    // CORRECTION ICI :
    // Cela signifie : "Trouve le RefreshToken où son 'client' a pour 'clientId' la valeur donnée"
    @Modifying
    @Transactional
    void deleteByClientClientId(Long clientId);
}