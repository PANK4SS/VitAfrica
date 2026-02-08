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
@Table(name="Role")
public class Role {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="roleId")
    private Long roleId;

    @Column(name="roleName", nullable=false, unique = true)
    private String roleName;

    @Column(name="description", nullable=false)
    private String description;

    @ManyToMany(mappedBy="roleSet")
    @JsonBackReference
    private Set<Client> clientSet;

}
