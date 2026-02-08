package com.pankassi.accesscore.domain.model;

import jakarta.persistence.*;
import lombok.*;
// Imports Jackson (JSON)
import com.fasterxml.jackson.annotation.JsonBackReference;

// Import Java Util
import java.util.Set;



@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Table(name="Client")
public class Client {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name = "clientId")
    private Long clientId;

    @Column(name="clientName",nullable=false,length=100)
    private String clientName;

    @Column(name="email",nullable=false)
    private String email;

    @Column(name="password",nullable=false,length=255)
    private String password;

    @ManyToMany
    @JsonBackReference
    @JoinTable(
            name="ClientRole",
            joinColumns=@JoinColumn(name="clientId"),
            inverseJoinColumns=@JoinColumn(name="roleId")
    )
    private Set<Role> roleSet;
}
