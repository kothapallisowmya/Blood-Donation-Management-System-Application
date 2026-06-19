package com.blooddonation.system.controller;

import com.blooddonation.system.dto.BloodRequestDto;
import com.blooddonation.system.dto.BloodRequestStatusUpdate;
import com.blooddonation.system.service.BloodRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blood-requests")
@Tag(name = "Blood Request Module", description = "Endpoints for managing patient blood requests and status workflows")
public class BloodRequestController {

    private final BloodRequestService bloodRequestService;

    public BloodRequestController(BloodRequestService bloodRequestService) {
        this.bloodRequestService = bloodRequestService;
    }

    @PostMapping
    @Operation(summary = "Submit a blood request", description = "Submits a new patient request for blood units (default status is PENDING)")
    public ResponseEntity<BloodRequestDto> createRequest(@Valid @RequestBody BloodRequestDto requestDto) {
        BloodRequestDto response = bloodRequestService.createRequest(requestDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all requests", description = "Lists all blood requests submitted in the system")
    public ResponseEntity<List<BloodRequestDto>> getAllRequests() {
        return ResponseEntity.ok(bloodRequestService.getAllRequests());
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update request status", description = "Approves, fulfills, or rejects a blood request by ID")
    public ResponseEntity<BloodRequestDto> updateStatus(@PathVariable Long id,
                                                        @Valid @RequestBody BloodRequestStatusUpdate statusUpdate) {
        BloodRequestDto response = bloodRequestService.updateStatus(id, statusUpdate);
        return ResponseEntity.ok(response);
    }
}
