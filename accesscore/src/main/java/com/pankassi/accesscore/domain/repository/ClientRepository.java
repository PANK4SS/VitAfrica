package com.pankassi.accesscore.domain.repository;

import com.pankassi.accesscore.domain.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client,Long> {
    boolean existByEmail(String email);
}
