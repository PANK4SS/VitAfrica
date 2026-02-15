package com.pankassi.backend.domain.repository.web;

import com.pankassi.accesscore.domain.model.Client;
import com.pankassi.backend.domain.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff,Long> {
    Optional<Staff> findByClient(Client client);
}
