package com.blooddonation.system.service.impl;

import com.blooddonation.system.dto.AdminDashboardResponse;
import com.blooddonation.system.repository.BloodRequestRepository;
import com.blooddonation.system.repository.DonorRepository;
import com.blooddonation.system.repository.UserRepository;
import com.blooddonation.system.service.AdminService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final BloodRequestRepository bloodRequestRepository;

    public AdminServiceImpl(UserRepository userRepository,
                            DonorRepository donorRepository,
                            BloodRequestRepository bloodRequestRepository) {
        this.userRepository = userRepository;
        this.donorRepository = donorRepository;
        this.bloodRequestRepository = bloodRequestRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalDonors = donorRepository.count();
        long totalRequests = bloodRequestRepository.count();
        long availableDonors = donorRepository.countByAvailableForDonation(true);

        return AdminDashboardResponse.builder()
                .totalUsers(totalUsers)
                .totalDonors(totalDonors)
                .totalRequests(totalRequests)
                .availableDonors(availableDonors)
                .build();
    }
}
