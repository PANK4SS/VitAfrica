package com.pankassi.backend.domain.repository;

import com.pankassi.accesscore.domain.model.Client;
import com.pankassi.backend.domain.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByClient(Client client);
}
