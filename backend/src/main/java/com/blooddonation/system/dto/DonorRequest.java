package com.blooddonation.system.dto;

import com.blooddonation.system.enums.BloodGroup;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class DonorRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Blood group is required")
    private BloodGroup bloodGroup;

    @NotNull(message = "Age is required")
    @Min(value = 18, message = "Donor age must be at least 18 years")
    @Max(value = 65, message = "Donor age cannot exceed 65 years")
    private Integer age;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotNull(message = "Weight is required")
    @Min(value = 45, message = "Donor weight must be at least 45 kg")
    private Double weight;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    private LocalDate lastDonationDate;

    private boolean availableForDonation = true;

    public DonorRequest() {
    }

    public DonorRequest(Long userId, BloodGroup bloodGroup, Integer age, String gender, Double weight, String city, String state, LocalDate lastDonationDate, boolean availableForDonation) {
        this.userId = userId;
        this.bloodGroup = bloodGroup;
        this.age = age;
        this.gender = gender;
        this.weight = weight;
        this.city = city;
        this.state = state;
        this.lastDonationDate = lastDonationDate;
        this.availableForDonation = availableForDonation;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public BloodGroup getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(BloodGroup bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public LocalDate getLastDonationDate() {
        return lastDonationDate;
    }

    public void setLastDonationDate(LocalDate lastDonationDate) {
        this.lastDonationDate = lastDonationDate;
    }

    public boolean isAvailableForDonation() {
        return availableForDonation;
    }

    public void setAvailableForDonation(boolean availableForDonation) {
        this.availableForDonation = availableForDonation;
    }
}
