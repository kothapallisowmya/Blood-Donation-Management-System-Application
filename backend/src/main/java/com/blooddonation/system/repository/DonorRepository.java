package com.blooddonation.system.repository;

import com.blooddonation.system.entity.Donor;
import com.blooddonation.system.enums.BloodGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonorRepository extends JpaRepository<Donor, Long> {
    List<Donor> findByBloodGroup(BloodGroup bloodGroup);
    List<Donor> findByCityIgnoreCase(String city);
    List<Donor> findByAvailableForDonation(boolean availableForDonation);
    Optional<Donor> findByUserId(Long userId);
    
    long countByAvailableForDonation(boolean availableForDonation);
}
