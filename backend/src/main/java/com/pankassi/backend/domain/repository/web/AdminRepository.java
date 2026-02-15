package com.pankassi.backend.domain.repository.web;

import com.pankassi.accesscore.domain.model.Client;
import com.pankassi.backend.domain.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin,Long> {
    Optional<Admin> findByClient(Client client);
}
