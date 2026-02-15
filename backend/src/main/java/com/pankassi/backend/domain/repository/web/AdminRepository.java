package com.pankassi.backend.domain.repository.web;

import com.pankassi.backend.domain.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin,Long> {
}
