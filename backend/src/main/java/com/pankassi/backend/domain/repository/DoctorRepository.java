package com.pankassi.backend.domain.repository;

import com.pankassi.accesscore.domain.model.Client;
import com.pankassi.backend.domain.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor,Long> {

    Optional<Doctor> findByClient(Client client);


    long countByDepartment(String department);

    // STAFF — for the select doctor during the appointment creation
    List<Doctor> findAllByOrderByDepartmentAsc();
}
