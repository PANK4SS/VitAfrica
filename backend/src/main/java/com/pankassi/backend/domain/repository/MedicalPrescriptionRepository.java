package com.pankassi.backend.domain.repository;

import com.pankassi.backend.domain.model.MedicalPrescription;
import com.pankassi.backend.domain.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalPrescriptionRepository extends JpaRepository<MedicalPrescription,Long> {
    List<MedicalPrescription> findByPatientOrderByPrescriptionDateDesc(Patient patient);
}
