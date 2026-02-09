package com.pankassi.accesscore.domain.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Table(name="Resource")
public class Resource {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="resourceId")
    private Long resourceId;

    @Column(name = "resourceName", nullable = false, unique = true)
    @EqualsAndHashCode.Include
    private String resourceName;

    @Column(name = "resourceDescription")
    private String resourceDescription;

    @ManyToMany(mappedBy="resourceSet")
    @JsonManagedReference
    private Set<Role> roleSet;
}
