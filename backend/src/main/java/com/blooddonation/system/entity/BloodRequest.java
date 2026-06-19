package com.blooddonation.system.entity;

import com.blooddonation.system.enums.BloodGroup;
import com.blooddonation.system.enums.RequestStatus;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "blood_requests")
public class BloodRequest extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_name", nullable = false)
    private String patientName;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_group", nullable = false)
    private BloodGroup bloodGroup;

    @Column(name = "units_required", nullable = false)
    private Integer unitsRequired;

    @Column(name = "hospital_name", nullable = false)
    private String hospitalName;

    @Column(nullable = false)
    private String city;

    @Column(name = "required_date", nullable = false)
    private LocalDate requiredDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "contact_number", nullable = false)
    private String contactNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.PENDING;

    public BloodRequest() {
    }

    public BloodRequest(Long id, User user, String patientName, BloodGroup bloodGroup, Integer unitsRequired, String hospitalName, String city, LocalDate requiredDate, String contactNumber, RequestStatus status) {
        this.id = id;
        this.user = user;
        this.patientName = patientName;
        this.bloodGroup = bloodGroup;
        this.unitsRequired = unitsRequired;
        this.hospitalName = hospitalName;
        this.city = city;
        this.requiredDate = requiredDate;
        this.contactNumber = contactNumber;
        this.status = status;
    }

    public BloodRequest(Long id, String patientName, BloodGroup bloodGroup, Integer unitsRequired, String hospitalName, String city, LocalDate requiredDate, String contactNumber, RequestStatus status) {
        this(id, null, patientName, bloodGroup, unitsRequired, hospitalName, city, requiredDate, contactNumber, status);
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

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public BloodGroup getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(BloodGroup bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public Integer getUnitsRequired() {
        return unitsRequired;
    }

    public void setUnitsRequired(Integer unitsRequired) {
        this.unitsRequired = unitsRequired;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public LocalDate getRequiredDate() {
        return requiredDate;
    }

    public void setRequiredDate(LocalDate requiredDate) {
        this.requiredDate = requiredDate;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private User user;
        private String patientName;
        private BloodGroup bloodGroup;
        private Integer unitsRequired;
        private String hospitalName;
        private String city;
        private LocalDate requiredDate;
        private String contactNumber;
        private RequestStatus status = RequestStatus.PENDING;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder user(User user) {
            this.user = user;
            return this;
        }

        public Builder patientName(String patientName) {
            this.patientName = patientName;
            return this;
        }

        public Builder bloodGroup(BloodGroup bloodGroup) {
            this.bloodGroup = bloodGroup;
            return this;
        }

        public Builder unitsRequired(Integer unitsRequired) {
            this.unitsRequired = unitsRequired;
            return this;
        }

        public Builder hospitalName(String hospitalName) {
            this.hospitalName = hospitalName;
            return this;
        }

        public Builder city(String city) {
            this.city = city;
            return this;
        }

        public Builder requiredDate(LocalDate requiredDate) {
            this.requiredDate = requiredDate;
            return this;
        }

        public Builder contactNumber(String contactNumber) {
            this.contactNumber = contactNumber;
            return this;
        }

        public Builder status(RequestStatus status) {
            this.status = status;
            return this;
        }

        public BloodRequest build() {
            return new BloodRequest(id, user, patientName, bloodGroup, unitsRequired, hospitalName, city, requiredDate, contactNumber, status);
        }
    }
}
