package com.pankassi.backend.domain.repository;

import com.pankassi.accesscore.domain.model.Client;
import com.pankassi.backend.domain.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByClient(Client client);

    // STAFF
    @Query("SELECT p FROM Patient p WHERE " +
            "LOWER(p.client.clientName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "p.phone LIKE CONCAT('%', :search, '%')")
    List<Patient> searchByNameOrPhone(@Param("search") String search);
}
