package com.pankassi.backend.service;

import com.pankassi.accesscore.domain.model.Client;
import com.pankassi.accesscore.domain.repository.ClientRepository;
import com.pankassi.accesscore.domain.repository.RoleRepository;
import com.pankassi.backend.domain.model.*;
import com.pankassi.backend.domain.repository.DoctorRepository;
import com.pankassi.backend.domain.repository.PatientRepository;
import com.pankassi.backend.domain.repository.web.*;
import com.pankassi.backend.dto.request.ApproveRequestBody;
import com.pankassi.backend.dto.request.DepartmentResponse;
import com.pankassi.backend.dto.response.Admin.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final StaffRepository staffRepository;
    private final UserProfileRepository userProfileRepository;
    private final DepartmentRepository departmentRepository;
    private final ClientRepository clientRepository;
    private final RoleRepository roleRepository;

    // ================= DASHBOARD =================
    public AdminDashboardResponse usersStats() {
        return new AdminDashboardResponse(
                (int) patientRepository.count(),
                (int) doctorRepository.count(),
                (int) staffRepository.count(),
                (int) userProfileRepository.countByStatus(RequestStatus.PENDING)
        );
    }

    // ================= PENDING REQUESTS =================

    public List<PendingRequestResponse> getPendingRequests() {
        return userProfileRepository.findAllByStatus(RequestStatus.PENDING)
                .stream()
                .map(up -> new PendingRequestResponse(
                        up.getProfileId(),
                        up.getClient().getClientName(),
                        up.getClient().getEmail(),
                        up.getProfilePicUrl(),
                        up.getStatus().name()
                ))
                .toList();
    }

    @Transactional
    public void approveRequest(Long profileId, ApproveRequestBody body) {
        UserProfile profile = userProfileRepository.findById(profileId)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found"));

        if (profile.getStatus().isFinal()) {
            throw new IllegalStateException("This request has already been processed");
        }

        String roleName = body.role().toUpperCase();

        // 1. Assigner le rôle dans AccessCore
        var role = roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new IllegalArgumentException("Role not found: " + roleName));

        Client client = profile.getClient();
        client.getRoleSet().clear();
        clientRepository.saveAndFlush(client);  // ← force le DELETE en base avant l'INSERT
        client.getRoleSet().add(role);
        clientRepository.save(client);

        // 2. Créer le profil métier selon le rôle
        switch (roleName) {
            case "DOCTOR" -> {
                if (body.department() == null || body.department().isBlank()) {
                    throw new IllegalArgumentException("Department is required for DOCTOR role");
                }
                // Vérifie que le département existe
                Department dept = departmentRepository.findByName(body.department())
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Department not found: " + body.department()));

                Doctor doctor = Doctor.builder()
                        .client(client)
                        .department(dept.getName())
                        .build();
                doctorRepository.save(doctor);
            }
            case "STAFF" -> {
                Staff staff = Staff.builder().client(client).build();
                staffRepository.save(staff);
            }
            case "ADMIN" -> {
                // Pas de profil métier supplémentaire pour ADMIN
            }
            default -> throw new IllegalArgumentException("Unsupported role: " + roleName);
        }

        // 3. Marquer comme approuvé
        profile.setStatus(RequestStatus.APPROVED);
        userProfileRepository.save(profile);
    }

    @Transactional
    public void rejectRequest(Long profileId) {
        UserProfile profile = userProfileRepository.findById(profileId)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found"));

        if (profile.getStatus().isFinal()) {
            throw new IllegalStateException("This request has already been processed");
        }

        profile.setStatus(RequestStatus.REJECTED);
        userProfileRepository.save(profile);
    }

    // ================= PERSONNEL LIST =================

    public List<PersonnelResponse> getPersonnel(String roleFilter, String search) {
        RequestStatus statusFilter = RequestStatus.APPROVED; // on affiche que les approuvés

        return userProfileRepository.findByStatusAndSearch(statusFilter, search)
                .stream()
                .filter(up -> {
                    if (roleFilter == null || roleFilter.isBlank()) return true;
                    return up.getClient().getRoleSet().stream()
                            .anyMatch(r -> r.getRoleName().equalsIgnoreCase(roleFilter));
                })
                .map(up -> {
                    String role = up.getClient().getRoleSet().stream()
                            .map(r -> r.getRoleName())
                            .findFirst().orElse("UNKNOWN");

                    String department = null;
                    if ("DOCTOR".equals(role)) {
                        department = doctorRepository.findByClient(up.getClient())
                                .map(Doctor::getDepartment)
                                .orElse(null);
                    }

                    return new PersonnelResponse(
                            up.getClient().getClientId(),
                            up.getClient().getClientName(),
                            up.getClient().getEmail(),
                            up.getProfilePicUrl(),
                            role,
                            up.getStatus().name(),
                            department
                    );
                })
                .toList();
    }

    // ================= DEPARTMENTS =================

    public List<DepartmentResponse> getDepartments() {
        return departmentRepository.findAll()
                .stream()
                .map(dept -> new DepartmentResponse(
                        dept.getDepartmentId(),
                        dept.getName(),
                        doctorRepository.countByDepartment(dept.getName())
                ))
                .toList();
    }

    public void addDepartment(String name) {
        if (departmentRepository.existsByName(name)) {
            throw new IllegalStateException("Department already exists: " + name);
        }
        departmentRepository.save(Department.builder().name(name).build());
    }

    public void deleteDepartment(Long departmentId) {
        if (!departmentRepository.existsById(departmentId)) {
            throw new IllegalArgumentException("Department not found");
        }
        // Vérifie qu'aucun doctor n'est dans ce département
        Department dept = departmentRepository.findById(departmentId).get();
        if (doctorRepository.countByDepartment(dept.getName()) > 0) {
            throw new IllegalStateException(
                    "Cannot delete department with active doctors");
        }
        departmentRepository.deleteById(departmentId);
    }
}