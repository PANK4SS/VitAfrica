package com.pankassi.accesscore.domain.model;

import jakarta.persistence.*;
import lombok.*;

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

    
}
