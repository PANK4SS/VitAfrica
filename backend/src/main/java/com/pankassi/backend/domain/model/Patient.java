package com.pankassi.backend.domain.model;

import com.pankassi.accesscore.domain.model.Client;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

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

    @OneToOne
    @JoinColumn(
            name = "client_id",
            nullable = false,
            unique = true
    )
    private Client client;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<VitalSign> vitalSignsList = new ArrayList<>();

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Appointment> appointments = new ArrayList<>();

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MedicalPrescription> prescriptions = new ArrayList<>();
}
