package com.pankassi.backend.domain.repository;

import com.pankassi.backend.domain.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {
}
