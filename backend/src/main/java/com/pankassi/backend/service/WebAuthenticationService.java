package com.pankassi.backend.service;

import com.pankassi.accesscore.domain.model.Client;
import com.pankassi.accesscore.domain.repository.ClientRepository;
import com.pankassi.accesscore.dto.request.ClientRequest;
import com.pankassi.accesscore.dto.request.LoginRequest;
import com.pankassi.accesscore.dto.response.AuthenticationResponse;
import com.pankassi.accesscore.service.AuthenticationService;
import com.pankassi.backend.domain.model.RequestStatus;
import com.pankassi.backend.domain.model.UserProfile;
import com.pankassi.backend.domain.model.VitAfricaRoles;
import com.pankassi.backend.domain.repository.web.UserProfileRepository;
import com.pankassi.backend.dto.request.RegisterWebRequest;
import com.pankassi.backend.dto.response.WebCurrentUserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WebAuthenticationService {

    private final UserProfileRepository userProfileRepository;
    private final ClientRepository clientRepository;
    private final AuthenticationService accessCoreAuthService; // AccessCore dependency

    /**
     * Inital web inscription.
     * The account is created in accesscore but stay PENDING in the business system.
     */
    @Transactional
    public void registerWebUser(RegisterWebRequest request) {
        // Create client through accesscore
        // This user have temporary default role "USER"
        // who have access to nothing still not approved by the ADMIN
        ClientRequest clientRequest = new ClientRequest(
                request.email(),
                request.username(),
                request.password()
        );

        Client newClient = accessCoreAuthService.registerClient(clientRequest, String.valueOf(VitAfricaRoles.USER));

        // Create userProfile with PENDING status
        UserProfile profile = UserProfile.builder()
                .client(newClient)
                .profilePicUrl(request.profilePicUrl())
                .status(RequestStatus.PENDING)
                .build();

        userProfileRepository.save(profile);
    }

    //Login Patient
    @Transactional
    public AuthenticationResponse loginPatient(LoginRequest loginRequest){
        return accessCoreAuthService.login(loginRequest);
    }

    @Transactional(readOnly = true)
    public WebCurrentUserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new IllegalArgumentException("Unauthorized");
        }

        Client client = clientRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String profilePicUrl = userProfileRepository.findByClientClientId(client.getClientId())
                .map(UserProfile::getProfilePicUrl)
                .orElse(null);

        return new WebCurrentUserResponse(
                client.getEmail(),
                client.getClientName(),
                profilePicUrl
        );
    }
}
