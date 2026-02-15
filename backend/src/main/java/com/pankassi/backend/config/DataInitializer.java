package com.pankassi.backend.config;

import com.pankassi.accesscore.domain.model.Client;
import com.pankassi.accesscore.domain.model.Role;
import com.pankassi.accesscore.domain.repository.ClientRepository;
import com.pankassi.accesscore.domain.repository.RoleRepository;
import com.pankassi.backend.domain.model.RequestStatus;
import com.pankassi.backend.domain.model.UserProfile;
import com.pankassi.backend.domain.repository.web.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final ClientRepository clientRepository;
    private final RoleRepository roleRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;

    // ✅ Injectés depuis les variables d'environnement Railway
    @Value("${app.admin.email:admin@vitafrica.com}")
    private String adminEmail;

    @Value("${app.admin.password:Admin@2026!}")
    private String adminPassword;

    @Value("${app.admin.name:VitAfrica Admin}")
    private String adminName;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        createRolesIfNotExists();
        createAdminIfNotExists();
    }

    private void createRolesIfNotExists() {
        record RoleDef(String name, String description) {}

        var roles = List.of(
            new RoleDef("PATIENT", "Mobile app user"),
            new RoleDef("ADMIN",   "VitAfrica administrator"),
            new RoleDef("DOCTOR",  "VitAfrica doctor"),
            new RoleDef("STAFF",   "VitAfrica hospital staff"),
            new RoleDef("USER",    "Pending web user awaiting approval")
        );

        for (var roleDef : roles) {
            if (roleRepository.findByRoleName(roleDef.name()).isEmpty()) {
                Role role = new Role();
                role.setRoleName(roleDef.name());
                role.setDescription(roleDef.description());
                roleRepository.save(role);
                log.info("✅ Role created: {}", roleDef.name());
            }
        }
    }

    private void createAdminIfNotExists() {
        if (clientRepository.existsByEmail(adminEmail)) {
            log.info("✅ Admin already exists — skipping");
            return;
        }

        log.info("🚀 Creating default admin: {}", adminEmail);

        Role adminRole = roleRepository.findByRoleName("ADMIN")
                .orElseThrow(() -> new IllegalStateException("ADMIN role not found"));

        Client admin = new Client();
        admin.setClientName(adminName);
        admin.setEmail(adminEmail);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setRoleSet(Set.of(adminRole));
        clientRepository.save(admin);

        UserProfile profile = UserProfile.builder()
                .client(admin)
                .profilePicUrl("/assets/default-admin.png")
                .status(RequestStatus.APPROVED)
                .build();
        userProfileRepository.save(profile);

        log.info("✅ Admin created: {}", adminEmail);
    }
}



// package com.pankassi.backend.config;

// import com.pankassi.accesscore.domain.model.Client;
// import com.pankassi.accesscore.domain.model.Role;
// import com.pankassi.accesscore.domain.repository.ClientRepository;
// import com.pankassi.accesscore.domain.repository.RoleRepository;
// import com.pankassi.backend.domain.model.RequestStatus;
// import com.pankassi.backend.domain.model.UserProfile;
// import com.pankassi.backend.domain.repository.web.UserProfileRepository;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;
// import org.springframework.boot.ApplicationArguments;
// import org.springframework.boot.ApplicationRunner;
// import org.springframework.context.annotation.Profile;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.stereotype.Component;
// import org.springframework.transaction.annotation.Transactional;

// import java.util.List;
// import java.util.Set;

// @Slf4j
// @Component
// @Profile("dev")
// @RequiredArgsConstructor
// public class DataInitializer implements ApplicationRunner {

//     private final ClientRepository clientRepository;
//     private final RoleRepository roleRepository;
//     private final UserProfileRepository userProfileRepository;
//     private final PasswordEncoder passwordEncoder;

//     private static final String ADMIN_EMAIL    = "admin@vitafrica.com";
//     private static final String ADMIN_PASSWORD = "Admin@2026!";
//     private static final String ADMIN_NAME     = "VitAfrica Admin";

//     // ✅ UNE SEULE méthode run() qui appelle les deux dans l'ordre
//     @Override
//     @Transactional
//     public void run(ApplicationArguments args) {
//         createRolesIfNotExists();  // 1. Rôles d'abord
//         createAdminIfNotExists();  // 2. Admin ensuite
//     }

//     private void createRolesIfNotExists() {
//         record RoleDef(String name, String description) {}

//         var roles = List.of(
//                 new RoleDef("PATIENT", "Mobile app user"),
//                 new RoleDef("ADMIN",   "VitAfrica administrator"),
//                 new RoleDef("DOCTOR",  "VitAfrica doctor"),
//                 new RoleDef("STAFF",   "VitAfrica hospital staff"),
//                 new RoleDef("USER",    "Pending web user awaiting approval")
//         );

//         for (var roleDef : roles) {
//             if (roleRepository.findByRoleName(roleDef.name()).isEmpty()) {
//                 Role role = new Role();
//                 role.setRoleName(roleDef.name());
//                 role.setDescription(roleDef.description());
//                 roleRepository.save(role);
//                 log.info("✅ Role created: {}", roleDef.name());
//             }
//         }
//     }

//     private void createAdminIfNotExists() {
//         if (clientRepository.existsByEmail(ADMIN_EMAIL)) {
//             log.info("✅ Admin already exists — skipping initialization");
//             return;
//         }

//         log.info("🚀 No admin found — creating default admin...");

//         Role adminRole = roleRepository.findByRoleName("ADMIN")
//                 .orElseThrow(() -> new IllegalStateException(
//                         "ADMIN role not found — createRolesIfNotExists() should have created it"));

//         Client admin = new Client();
//         admin.setClientName(ADMIN_NAME);
//         admin.setEmail(ADMIN_EMAIL);
//         admin.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
//         admin.setRoleSet(Set.of(adminRole));
//         clientRepository.save(admin);

//         UserProfile profile = UserProfile.builder()
//                 .client(admin)
//                 .profilePicUrl("/assets/default-admin.png")
//                 .status(RequestStatus.APPROVED)
//                 .build();
//         userProfileRepository.save(profile);

//         log.info("✅ Default admin created");
//         log.info("📧 Email    : {}", ADMIN_EMAIL);
//         log.info("🔑 Password : {}", ADMIN_PASSWORD);
//         log.warn("⚠️  CHANGE THIS PASSWORD after first login!");
//     }
// }