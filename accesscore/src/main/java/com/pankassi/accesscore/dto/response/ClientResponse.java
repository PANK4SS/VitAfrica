package com.pankassi.accesscore.dto.response;

import com.pankassi.accesscore.domain.model.Client;

import java.util.Set;
import java.util.stream.Collectors;

public record ClientResponse(
    String clientName,
    String clientEmail,
    Set<String> roles
) {
    //Convert a Client Into a ClientResponse
    public static ClientResponse from(Client client){
        return new ClientResponse(
                client.getClientName(),
                client.getEmail(),
                client.getRoleSet()
                    .stream()
                    .map(role -> role.getRoleName())
                    .collect(Collectors.toSet()));
    }
}
