package com.pankassi.backend.domain.model;

import com.pankassi.accesscore.domain.model.Client;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "user_profile")
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id")
    private Long profileId;

    @Column(name= "profile_pic_url", nullable = false)
    private String profilePicUrl;

    @Column(name="status",unique = true)
    private String status;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clientId", unique = true, nullable = false)
    private Client client;
}
