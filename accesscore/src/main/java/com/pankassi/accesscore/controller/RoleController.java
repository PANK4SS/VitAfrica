package com.pankassi.accesscore.controller;

import com.pankassi.accesscore.domain.model.Role;
import com.pankassi.accesscore.dto.request.RoleRequest;
import com.pankassi.accesscore.dto.response.RoleResponse;
import com.pankassi.accesscore.service.RoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {
    @Autowired
    private final RoleService roleService;

    @PostMapping
    public ResponseEntity<RoleResponse> createRole(@Valid @RequestBody RoleRequest roleRequest){
        Role role = roleService.createRole(roleRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(RoleResponse.from(role));
    }
}
