package com.blooddonation.system.mapper;

import com.blooddonation.system.dto.DonorRequest;
import com.blooddonation.system.dto.DonorResponse;
import com.blooddonation.system.entity.Donor;
import com.blooddonation.system.entity.User;
import org.springframework.stereotype.Component;

@Component
public class DonorMapper {

    public Donor toEntity(DonorRequest request) {
        if (request == null) {
            return null;
        }
        
        return Donor.builder()
                .bloodGroup(request.getBloodGroup())
                .age(request.getAge())
                .gender(request.getGender())
                .weight(request.getWeight())
                .city(request.getCity())
                .state(request.getState())
                .lastDonationDate(request.getLastDonationDate())
                .availableForDonation(request.isAvailableForDonation())
                .build();
    }

    public DonorResponse toResponse(Donor donor) {
        if (donor == null) {
            return null;
        }

        DonorResponse.Builder builder = DonorResponse.builder()
                .id(donor.getId())
                .bloodGroup(donor.getBloodGroup())
                .age(donor.getAge())
                .gender(donor.getGender())
                .weight(donor.getWeight())
                .city(donor.getCity())
                .state(donor.getState())
                .lastDonationDate(donor.getLastDonationDate())
                .availableForDonation(donor.isAvailableForDonation())
                .createdAt(donor.getCreatedAt())
                .updatedAt(donor.getUpdatedAt());

        User user = donor.getUser();
        if (user != null) {
            builder.userId(user.getId())
                   .fullName(user.getFullName())
                   .email(user.getEmail())
                   .phoneNumber(user.getPhoneNumber());
        }

        return builder.build();
    }
}
