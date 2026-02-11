package com.pankassi.backend.domain.repository;

import com.pankassi.backend.domain.model.Appointment;
import com.pankassi.backend.domain.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Find last patient appointment filterd by date Desc
    Optional<Appointment> findFirstByPatientOrderByDateTimeDesc(Patient patient);
}