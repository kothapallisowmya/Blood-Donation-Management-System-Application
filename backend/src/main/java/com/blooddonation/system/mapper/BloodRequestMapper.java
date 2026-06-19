package com.blooddonation.system.mapper;

import com.blooddonation.system.dto.BloodRequestDto;
import com.blooddonation.system.entity.BloodRequest;
import com.blooddonation.system.entity.User;
import org.springframework.stereotype.Component;

@Component
public class BloodRequestMapper {

    public BloodRequest toEntity(BloodRequestDto dto) {
        if (dto == null) {
            return null;
        }

        User user = null;
        if (dto.getUserId() != null) {
            user = new User();
            user.setId(dto.getUserId());
        }

        return BloodRequest.builder()
                .user(user)
                .patientName(dto.getPatientName())
                .bloodGroup(dto.getBloodGroup())
                .unitsRequired(dto.getUnitsRequired())
                .hospitalName(dto.getHospitalName())
                .city(dto.getCity())
                .requiredDate(dto.getRequiredDate())
                .contactNumber(dto.getContactNumber())
                .status(dto.getStatus())
                .build();
    }

    public BloodRequestDto toDto(BloodRequest request) {
        if (request == null) {
            return null;
        }

        Long userId = (request.getUser() != null) ? request.getUser().getId() : null;

        return BloodRequestDto.builder()
                .id(request.getId())
                .userId(userId)
                .patientName(request.getPatientName())
                .bloodGroup(request.getBloodGroup())
                .unitsRequired(request.getUnitsRequired())
                .hospitalName(request.getHospitalName())
                .city(request.getCity())
                .requiredDate(request.getRequiredDate())
                .contactNumber(request.getContactNumber())
                .status(request.getStatus())
                .createdAt(request.getCreatedAt())
                .updatedAt(request.getUpdatedAt())
                .build();
    }
}
