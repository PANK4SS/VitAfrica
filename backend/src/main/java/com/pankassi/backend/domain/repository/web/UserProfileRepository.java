package com.pankassi.backend.domain.repository.web;

import com.pankassi.backend.domain.model.RequestStatus;
import com.pankassi.backend.domain.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserProfileRepository extends JpaRepository<UserProfile,Long> {
    //Number of pending request
    long countByStatus(RequestStatus status);

    //List of pending request
    List<UserProfile> findAllByStatus(String status);
}
