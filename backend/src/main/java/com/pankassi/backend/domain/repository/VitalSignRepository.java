package com.pankassi.backend.domain.repository;

import com.pankassi.backend.domain.model.VitalSign;
import com.pankassi.backend.domain.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VitalSignRepository extends JpaRepository<VitalSign, Long> {
    Optional<VitalSign> findFirstByPatientOrderByDateMeasuredDesc(Patient patient);
}