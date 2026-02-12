package com.pankassi.backend.domain.repository;

import com.pankassi.backend.domain.model.LabResult;
import com.pankassi.backend.domain.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LabResultRepository extends JpaRepository<LabResult, Long> {
    List<LabResult> findByPatientOrderByUploadedAtDesc(Patient patient);
}
