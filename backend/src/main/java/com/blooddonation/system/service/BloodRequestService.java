package com.blooddonation.system.service;

import com.blooddonation.system.dto.BloodRequestDto;
import com.blooddonation.system.dto.BloodRequestStatusUpdate;

import java.util.List;

public interface BloodRequestService {
    BloodRequestDto createRequest(BloodRequestDto requestDto);
    List<BloodRequestDto> getAllRequests();
    BloodRequestDto updateStatus(Long id, BloodRequestStatusUpdate statusUpdate);
}
