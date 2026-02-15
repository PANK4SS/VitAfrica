package com.pankassi.backend.service;

import com.pankassi.backend.domain.model.Doctor;
import com.pankassi.backend.domain.model.RequestStatus;
import com.pankassi.backend.domain.model.Staff;
import com.pankassi.backend.domain.model.UserProfile;
import com.pankassi.backend.domain.repository.DoctorRepository;
import com.pankassi.backend.domain.repository.PatientRepository;
import com.pankassi.backend.domain.repository.web.StaffRepository;
import com.pankassi.backend.domain.repository.web.UserProfileRepository;
import com.pankassi.backend.dto.response.Admin.AdminDashboardResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final StaffRepository staffRepository;
    private  final UserProfileRepository userProfileRepository;

    // ================= ADMIN DASHBOARD =================
    public AdminDashboardResponse usersStats(){
        return new AdminDashboardResponse(
                (int)patientRepository.count(),
                (int)doctorRepository.count(),
                (int)staffRepository.count(),
                (int)userProfileRepository.countByStatus(RequestStatus.PENDING)
        );
    }

    /**
     * User approbation logic
     */

    // ================= WEB REGISTRATION =================

    // ================= WEB LOGIN =================

    // ================= ADMIN DASHBOARD =================
}
