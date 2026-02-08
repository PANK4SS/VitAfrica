package com.pankassi.accesscore.domain.repository;
import com.pankassi.accesscore.domain.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface RoleRepository extends JpaRepository<Role,Long>{
    Optional<Role> findByRoleName(String roleName);

    boolean existsByRoleName(String roleName);
}
