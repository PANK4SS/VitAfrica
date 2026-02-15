package com.pankassi.backend.domain.repository;

import com.pankassi.backend.domain.model.Appointment;
import com.pankassi.backend.domain.model.Doctor;
import com.pankassi.backend.domain.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    // Find last patient appointment filtered by date Desc and status confirmed
    Optional<Appointment> findFirstByPatientAndStatusOrderByDateTimeDesc(Patient patient, String status);

    List<Appointment> findByPatientAndStatusInOrderByDateTimeDesc(Patient patient, List<String> statuses);

    // DOCTOR
    List<Appointment> findByDoctorOrderByDateTimeDesc(Doctor doctor);
    List<Appointment> findByDoctorAndStatusOrderByDateTimeDesc(Doctor doctor, String status);
    long countByDoctorAndStatus(Doctor doctor, String status);

    //STAFF
    List<Appointment> findByPatientOrderByDateTimeDesc(Patient patient);
}