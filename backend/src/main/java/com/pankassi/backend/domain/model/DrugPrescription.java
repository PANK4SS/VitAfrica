package com.pankassi.backend.domain.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "drug_prescription")
public class DrugPrescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "drug_prescription_id")
    private Long drugPrescriptionId;

    @Column(nullable = false)
    private String drugName;           // ex: "Paracetamol"

    @Column(nullable = false)
    private String dosage;             // ex: "500mg"

    @Column(nullable = false)
    private String frequency;          // ex: "3x/day"

    @Column(nullable = false)
    private Integer durationDays;      // ex: 5

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id", nullable = false)
    private MedicalPrescription prescription;
}