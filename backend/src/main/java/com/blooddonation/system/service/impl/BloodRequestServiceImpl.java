package com.blooddonation.system.service.impl;

import com.blooddonation.system.dto.BloodRequestDto;
import com.blooddonation.system.dto.BloodRequestStatusUpdate;
import com.blooddonation.system.entity.BloodRequest;
import com.blooddonation.system.entity.User;
import com.blooddonation.system.enums.RequestStatus;
import com.blooddonation.system.exception.ResourceNotFoundException;
import com.blooddonation.system.mapper.BloodRequestMapper;
import com.blooddonation.system.repository.BloodRequestRepository;
import com.blooddonation.system.service.BloodRequestService;
import com.blooddonation.system.service.NotificationService;
import com.blooddonation.system.service.EmailService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BloodRequestServiceImpl implements BloodRequestService {

    private final BloodRequestRepository bloodRequestRepository;
    private final BloodRequestMapper bloodRequestMapper;
    private final NotificationService notificationService;
    private final EmailService emailService;

    public BloodRequestServiceImpl(BloodRequestRepository bloodRequestRepository,
                                   BloodRequestMapper bloodRequestMapper,
                                   NotificationService notificationService,
                                   EmailService emailService) {
        this.bloodRequestRepository = bloodRequestRepository;
        this.bloodRequestMapper = bloodRequestMapper;
        this.notificationService = notificationService;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public BloodRequestDto createRequest(BloodRequestDto requestDto) {
        BloodRequest bloodRequest = bloodRequestMapper.toEntity(requestDto);
        bloodRequest.setStatus(RequestStatus.PENDING); // Force PENDING on creation

        BloodRequest savedRequest = bloodRequestRepository.save(bloodRequest);
        return bloodRequestMapper.toDto(savedRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BloodRequestDto> getAllRequests() {
        return bloodRequestRepository.findAll().stream()
                .map(bloodRequestMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BloodRequestDto updateStatus(Long id, BloodRequestStatusUpdate statusUpdate) {
        BloodRequest bloodRequest = bloodRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blood request not found with id: " + id));

        RequestStatus oldStatus = bloodRequest.getStatus();
        RequestStatus newStatus = statusUpdate.getStatus();
        bloodRequest.setStatus(newStatus);
        
        BloodRequest updatedRequest = bloodRequestRepository.save(bloodRequest);

        // Notify user if status changed to APPROVED or REJECTED
        if (newStatus != oldStatus && (newStatus == RequestStatus.APPROVED || newStatus == RequestStatus.REJECTED)) {
            User user = bloodRequest.getUser();
            if (user != null) {
                String messageText = String.format("Your blood request for patient '%s' has been %s by the administrator.", 
                        bloodRequest.getPatientName(), newStatus.toString());
                
                // Create In-App Notification
                notificationService.createNotification(user.getId(), messageText);

                // Send Email Notification
                String subject = "Blood Request Status Updated: " + newStatus;
                emailService.sendNotificationEmail(user.getEmail(), subject, messageText);
            }
        }

        return bloodRequestMapper.toDto(updatedRequest);
    }
}
