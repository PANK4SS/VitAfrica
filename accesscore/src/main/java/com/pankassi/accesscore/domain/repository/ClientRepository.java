package com.pankassi.accesscore.domain.repository;

import com.pankassi.accesscore.domain.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client,Long> {
    boolean existsByEmail(String email);
    Optional<Client> findByEmail(String email);

    @Query("""
            SELECT DISTINCT c
            FROM Client c
            LEFT JOIN FETCH c.roleSet r
            LEFT JOIN FETCH r.resourceSet
            WHERE c.email = :email
            """)
    Optional<Client> findByEmailWithRolesAndResources(@Param("email") String email);
}
