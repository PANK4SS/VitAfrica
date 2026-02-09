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

    // The technical code (e.g., "BOOK_CREATE")
    // This is what you will use in @PreAuthorize("hasAuthority('BOOK_CREATE')")
    @Column(name = "resourceName", nullable = false, unique = true)
    @EqualsAndHashCode.Include
    private String resourceName;

    @Column(name = "resourceDescription")
    private String resourceDescription;

    // The corresponding HTTP method
    @Column(name = "httpMethod", nullable = false)
    private String httpMethod; // "GET", "POST", "PUT", "DELETE"

    // The endpoint path (Ant pattern)
    @Column(name = "endpoint", nullable = false)
    private String endpoint; // "/api/books"

    @ManyToMany(mappedBy="resourceSet")
    @JsonManagedReference
    private Set<Role> roleSet;
}
