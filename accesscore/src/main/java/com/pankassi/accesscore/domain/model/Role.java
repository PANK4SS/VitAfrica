package com.pankassi.accesscore.domain.model;

@Entity
@Getter
@Setter
@Builder
@AllArgsRequired
@NoArgsRequired
@Table(namme="Role")
@Builder
public class Role {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="roleId")
    private Long roleId;

    @Column(name="roleName", nullable=false)
    private String roleName;

    @Column(name="description", nullable=false)
    private String description;
}
