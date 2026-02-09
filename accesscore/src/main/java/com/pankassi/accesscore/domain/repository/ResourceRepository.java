package com.pankassi.accesscore.domain.repository;

import com.pankassi.accesscore.domain.model.Resource;
import com.pankassi.accesscore.domain.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ResourceRepository extends JpaRepository<Resource,Long> {
    Optional<Role> findByResourceName(String resourceName);
    boolean existsByResourceName(String resourceName);
}
