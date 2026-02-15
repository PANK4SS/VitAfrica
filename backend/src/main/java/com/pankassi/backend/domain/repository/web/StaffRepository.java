package com.pankassi.backend.domain.repository.web;

import com.pankassi.backend.domain.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffRepository extends JpaRepository<Staff,Long> {
}
