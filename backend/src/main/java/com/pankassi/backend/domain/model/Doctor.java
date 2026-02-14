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
@Table(name = "doctor")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "doctor_id")
    private Long doctorId;

    @Column(nullable = false)
    private String department;


    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clientId", unique = true, nullable = false)
    private Client client;


    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Appointment> appointments = new ArrayList<>();

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MedicalPrescription> prescriptions = new ArrayList<>();
}