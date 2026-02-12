package com.pankassi.backend.domain.repository;

import com.pankassi.backend.domain.model.VitalSign;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VitalSignRepository extends JpaRepository<VitalSign,Long> {
}
