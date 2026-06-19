package com.blooddonation.system.service;

import com.blooddonation.system.dto.DonorRequest;
import com.blooddonation.system.dto.DonorResponse;
import com.blooddonation.system.enums.BloodGroup;

import java.util.List;

public interface DonorService {
    DonorResponse registerDonor(DonorRequest request);
    List<DonorResponse> getAllDonors();
    DonorResponse getDonorById(Long id);
    DonorResponse updateDonor(Long id, DonorRequest request);
    void deleteDonor(Long id);
    
    List<DonorResponse> searchByBloodGroup(BloodGroup bloodGroup);
    List<DonorResponse> searchByCity(String city);
    List<DonorResponse> searchByAvailability(boolean available);
}
