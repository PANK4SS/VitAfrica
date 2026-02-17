package com.pankassi.backend.domain.repository.web;

import com.pankassi.accesscore.domain.model.Client;
import com.pankassi.backend.domain.model.RequestStatus;
import com.pankassi.backend.domain.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile,Long> {
    //Number of pending request
    long countByStatus(RequestStatus status);

    //List of pending request
    List<UserProfile> findAllByStatus(RequestStatus status);

    Optional<UserProfile> findByClientClientId(Long clientId);

    Optional<UserProfile> findByClient(Client client);

    //Search by client name
    @Query("SELECT up FROM UserProfile up WHERE " +
            "LOWER(up.client.clientName) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<UserProfile> searchByName(@Param("search") String search);

    //Filter by status combine with name
    @Query("SELECT up FROM UserProfile up WHERE " +
            "(:status IS NULL OR up.status = :status) AND " +
            "(:search IS NULL OR LOWER(up.client.clientName) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<UserProfile> findByStatusAndSearch(
            @Param("status") RequestStatus status,
            @Param("search") String search);
}
