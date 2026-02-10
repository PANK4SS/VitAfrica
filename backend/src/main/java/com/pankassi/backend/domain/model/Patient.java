package com.pankassi.backend.domain.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.pankassi.accesscore.domain.model.Client;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "patient")
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "patientId")
    private Long patientId;

    // Profile pic img url location
    @Column(nullable = false)
    private String profilePicUrl;

    //+226 00 00 00 00
    @Column(nullable = false, unique = true)
    private String phone;

    @Column(nullable = false)
    private String locationAddress;
    

}
