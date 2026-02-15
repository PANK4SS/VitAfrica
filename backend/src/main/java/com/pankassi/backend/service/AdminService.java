package com.pankassi.backend.service;

import com.pankassi.backend.domain.repository.DoctorRepository;
import com.pankassi.backend.domain.repository.PatientRepository;
import com.pankassi.backend.domain.repository.web.StaffRepository;
import com.pankassi.backend.domain.repository.web.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final StaffRepository staffRepository;
    private  final UserProfileRepository userProfileRepository;

    
}
