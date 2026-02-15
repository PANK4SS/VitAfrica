package com.pankassi.backend.domain.model;

public enum RequestStatus {
    PENDING,
    APPROVED,
    REJECTED;
    public boolean isFinal() {
        return this == APPROVED || this == REJECTED;
    }
}
