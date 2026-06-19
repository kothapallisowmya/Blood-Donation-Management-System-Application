package com.blooddonation.system.entity;

import com.blooddonation.system.enums.BloodGroup;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "donors", indexes = {
    @Index(name = "idx_donors_blood_group", columnList = "blood_group"),
    @Index(name = "idx_donors_city", columnList = "city"),
    @Index(name = "idx_donors_available", columnList = "available_for_donation")
})
public class Donor extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_group", nullable = false)
    private BloodGroup bloodGroup;

    @Column(nullable = false)
    private Integer age;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private Double weight;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(name = "last_donation_date")
    private LocalDate lastDonationDate;

    @Column(name = "available_for_donation", nullable = false)
    private boolean availableForDonation = true;

    public Donor() {
    }

    public Donor(Long id, User user, BloodGroup bloodGroup, Integer age, String gender, Double weight, String city, String state, LocalDate lastDonationDate, boolean availableForDonation) {
        this.id = id;
        this.user = user;
        this.bloodGroup = bloodGroup;
        this.age = age;
        this.gender = gender;
        this.weight = weight;
        this.city = city;
        this.state = state;
        this.lastDonationDate = lastDonationDate;
        this.availableForDonation = availableForDonation;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private User user;
        private BloodGroup bloodGroup;
        private Integer age;
        private String gender;
        private Double weight;
        private String city;
        private String state;
        private LocalDate lastDonationDate;
        private boolean availableForDonation = true;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder user(User user) {
            this.user = user;
            return this;
        }

        public Builder bloodGroup(BloodGroup bloodGroup) {
            this.bloodGroup = bloodGroup;
            return this;
        }

        public Builder age(Integer age) {
            this.age = age;
            return this;
        }

        public Builder gender(String gender) {
            this.gender = gender;
            return this;
        }

        public Builder weight(Double weight) {
            this.weight = weight;
            return this;
        }

        public Builder city(String city) {
            this.city = city;
            return this;
        }

        public Builder state(String state) {
            this.state = state;
            return this;
        }

        public Builder lastDonationDate(LocalDate lastDonationDate) {
            this.lastDonationDate = lastDonationDate;
            return this;
        }

        public Builder availableForDonation(boolean availableForDonation) {
            this.availableForDonation = availableForDonation;
            return this;
        }

        public Donor build() {
            return new Donor(id, user, bloodGroup, age, gender, weight, city, state, lastDonationDate, availableForDonation);
        }
    }
}
