package com.pankassi.accesscore.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
@Table(name="Role")
public class Role {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="roleId")
    private Long roleId;

    @Column(name="roleName", nullable=false, unique = true)
    @EqualsAndHashCode.Include
    private String roleName;

    @Column(name="description", nullable=false)
    private String description;

    @ManyToMany(mappedBy="roleSet")
    @JsonManagedReference
    private Set<Client> clientSet;

    @ManyToMany
    @JsonIgnore
    @JoinTable(
            name = "RoleResource",
            joinColumns = @JoinColumn(name = "roleId"),
            inverseJoinColumns = @JoinColumn(name = "resourceId")
    )
    @Builder.Default
    private Set<Resource> resourceSet = new HashSet<>();
}
