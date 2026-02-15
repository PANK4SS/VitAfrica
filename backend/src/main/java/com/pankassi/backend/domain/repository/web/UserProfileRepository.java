package com.pankassi.backend.domain.repository.web;

import com.pankassi.backend.domain.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<UserProfile,Long> {
}
