package com.pankassi.accesscore.controller;

import com.pankassi.accesscore.domain.model.Client;
import com.pankassi.accesscore.dto.request.AssignRolesRequest;
import com.pankassi.accesscore.service.ClientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
public class ClientController {
    private final ClientService clientService;

    @PostMapping("/{email}/roles")
    public ResponseEntity<Client> assignRoles(
            @PathVariable String email,
            @Valid @RequestBody AssignRolesRequest request
    ) {
        Client updatedClient = clientService.assignRoles(email, request.roles());
        return ResponseEntity.ok(updatedClient);
    }
}
