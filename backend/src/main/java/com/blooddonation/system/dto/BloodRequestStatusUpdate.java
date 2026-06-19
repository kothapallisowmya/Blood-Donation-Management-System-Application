package com.blooddonation.system.dto;

import com.blooddonation.system.enums.RequestStatus;
import jakarta.validation.constraints.NotNull;

public class BloodRequestStatusUpdate {

    @NotNull(message = "Status is required")
    private RequestStatus status;

    public BloodRequestStatusUpdate() {
    }

    public BloodRequestStatusUpdate(RequestStatus status) {
        this.status = status;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }
}
