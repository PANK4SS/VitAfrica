package com.pankassi.accesscore.controller;

import com.pankassi.accesscore.domain.model.Client;
import com.pankassi.accesscore.dto.request.AssignRolesRequest;
import com.pankassi.accesscore.dto.response.ClientResponse;
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

    //Assign existing role to an existing client endpoint
    @PostMapping("/{email}/roles")
    public ResponseEntity<ClientResponse> assignRoles(@PathVariable String email, @Valid @RequestBody AssignRolesRequest request
    ) {
        Client updatedClient = clientService.assignRoles(email, request.roles());
        ClientResponse response = ClientResponse.from(updatedClient);  // ← Conversion en DTO
        return ResponseEntity.ok(response);
    }
}