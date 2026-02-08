package com.pankassi.accesscore.domain.model;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name="Client")
public class Client {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name = "client")
    private Long clientId;

    @Column(name="clientName",nullable=false,length=100)
    private String clientName;

    @Column(name="email",nullable=false)
    private String emai;

    @Column(name="password",nullable=false,length=16)
    private String password;
}
