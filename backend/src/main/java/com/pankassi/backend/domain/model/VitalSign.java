package com.pankassi.backend.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "vitalSign")
public class VitalSign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vitalSignId")
    private Long vitalSignId;

    @Column(name = "blood_pressure")
    private String bloodPressure;

    @Column(name = "heart_rate")
    private Integer heartRate;

    @Column(name = "temperature")
    private Double temperature;

    @Column(name = "weight")
    private Double weight;

    @Column(name = "date_measured", nullable = false)
    private LocalDateTime dateMeasured;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patientId", nullable = false)
    private Patient patient;
}