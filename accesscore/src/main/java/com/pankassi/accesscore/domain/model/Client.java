package com.pankassi.accesscore.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

// Import Java Util
import java.util.HashSet;
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
    @EqualsAndHashCode.Include
    private String email;

    @Column(name="password",nullable=false,length=255)
    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    @JsonIgnore
    @JoinTable(
            name="ClientRole",
            joinColumns=@JoinColumn(name="clientId"),
            inverseJoinColumns=@JoinColumn(name="roleId")
    )
    @Builder.Default
    private Set<Role> roleSet = new HashSet<>();
}
