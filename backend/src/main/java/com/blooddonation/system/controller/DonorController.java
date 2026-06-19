package com.blooddonation.system.controller;

import com.blooddonation.system.dto.DonorRequest;
import com.blooddonation.system.dto.DonorResponse;
import com.blooddonation.system.enums.BloodGroup;
import com.blooddonation.system.service.DonorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donors")
@Tag(name = "Donor Management", description = "Endpoints for managing donors and search operations")
public class DonorController {

    private final DonorService donorService;

    public DonorController(DonorService donorService) {
        this.donorService = donorService;
    }

    @PostMapping
    @Operation(summary = "Register a donor", description = "Associates an existing User record with a new Donor profile")
    public ResponseEntity<DonorResponse> registerDonor(@Valid @RequestBody DonorRequest request) {
        DonorResponse response = donorService.registerDonor(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all donors", description = "Lists all registered donors in the system")
    public ResponseEntity<List<DonorResponse>> getAllDonors() {
        return ResponseEntity.ok(donorService.getAllDonors());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get donor by ID", description = "Retrieves a donor's profile by their donor database ID")
    public ResponseEntity<DonorResponse> getDonorById(@PathVariable Long id) {
        return ResponseEntity.ok(donorService.getDonorById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update donor profile", description = "Updates dynamic criteria like availability, weight, location details")
    public ResponseEntity<DonorResponse> updateDonor(@PathVariable Long id, @Valid @RequestBody DonorRequest request) {
        return ResponseEntity.ok(donorService.updateDonor(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete donor profile", description = "Removes a donor's profile from the system")
    public ResponseEntity<Void> deleteDonor(@PathVariable Long id) {
        donorService.deleteDonor(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search/blood-group/{bloodGroup}")
    @Operation(summary = "Search donors by blood group", description = "Retrieves all donors matching a specific blood group")
    public ResponseEntity<List<DonorResponse>> searchByBloodGroup(@PathVariable BloodGroup bloodGroup) {
        return ResponseEntity.ok(donorService.searchByBloodGroup(bloodGroup));
    }

    @GetMapping("/search/city/{city}")
    @Operation(summary = "Search donors by city", description = "Retrieves all donors matching a specific city (case-insensitive)")
    public ResponseEntity<List<DonorResponse>> searchByCity(@PathVariable String city) {
        return ResponseEntity.ok(donorService.searchByCity(city));
    }

    @GetMapping("/search/available")
    @Operation(summary = "Search active donors", description = "Lists all donors marked as available for immediate donation")
    public ResponseEntity<List<DonorResponse>> searchByAvailability() {
        return ResponseEntity.ok(donorService.searchByAvailability(true));
    }
}
