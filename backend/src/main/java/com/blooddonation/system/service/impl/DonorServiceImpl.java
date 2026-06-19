package com.blooddonation.system.service.impl;

import com.blooddonation.system.dto.DonorRequest;
import com.blooddonation.system.dto.DonorResponse;
import com.blooddonation.system.entity.Donor;
import com.blooddonation.system.entity.User;
import com.blooddonation.system.enums.BloodGroup;
import com.blooddonation.system.exception.ResourceNotFoundException;
import com.blooddonation.system.exception.ValidationException;
import com.blooddonation.system.mapper.DonorMapper;
import com.blooddonation.system.repository.DonorRepository;
import com.blooddonation.system.repository.UserRepository;
import com.blooddonation.system.service.DonorService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonorServiceImpl implements DonorService {

    private final DonorRepository donorRepository;
    private final UserRepository userRepository;
    private final DonorMapper donorMapper;

    public DonorServiceImpl(DonorRepository donorRepository,
                            UserRepository userRepository,
                            DonorMapper donorMapper) {
        this.donorRepository = donorRepository;
        this.userRepository = userRepository;
        this.donorMapper = donorMapper;
    }

    @Override
    @Transactional
    public DonorResponse registerDonor(DonorRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        if (donorRepository.findByUserId(user.getId()).isPresent()) {
            throw new ValidationException("User is already registered as a donor");
        }

        Donor donor = donorMapper.toEntity(request);
        donor.setUser(user); // Ensure reference is bound to the managed database user

        Donor savedDonor = donorRepository.save(donor);
        return donorMapper.toResponse(savedDonor);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DonorResponse> getAllDonors() {
        return donorRepository.findAll().stream()
                .map(donorMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DonorResponse getDonorById(Long id) {
        Donor donor = donorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with id: " + id));
        return donorMapper.toResponse(donor);
    }

    @Override
    @Transactional
    public DonorResponse updateDonor(Long id, DonorRequest request) {
        Donor donor = donorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with id: " + id));

        // If the user association is being updated, verify the new user
        if (!donor.getUser().getId().equals(request.getUserId())) {
            User newUser = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));
            
            // Check if the new user is already a donor
            donorRepository.findByUserId(newUser.getId()).ifPresent(d -> {
                if (!d.getId().equals(donor.getId())) {
                    throw new ValidationException("User is already registered as a donor");
                }
            });
            donor.setUser(newUser);
        }

        donor.setBloodGroup(request.getBloodGroup());
        donor.setAge(request.getAge());
        donor.setGender(request.getGender());
        donor.setWeight(request.getWeight());
        donor.setCity(request.getCity());
        donor.setState(request.getState());
        donor.setLastDonationDate(request.getLastDonationDate());
        donor.setAvailableForDonation(request.isAvailableForDonation());

        Donor updatedDonor = donorRepository.save(donor);
        return donorMapper.toResponse(updatedDonor);
    }

    @Override
    @Transactional
    public void deleteDonor(Long id) {
        if (!donorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Donor not found with id: " + id);
        }
        donorRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DonorResponse> searchByBloodGroup(BloodGroup bloodGroup) {
        return donorRepository.findByBloodGroup(bloodGroup).stream()
                .map(donorMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DonorResponse> searchByCity(String city) {
        return donorRepository.findByCityIgnoreCase(city).stream()
                .map(donorMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DonorResponse> searchByAvailability(boolean available) {
        return donorRepository.findByAvailableForDonation(available).stream()
                .map(donorMapper::toResponse)
                .collect(Collectors.toList());
    }
}
