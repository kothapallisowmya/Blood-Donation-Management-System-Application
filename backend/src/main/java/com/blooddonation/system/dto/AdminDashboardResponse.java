package com.blooddonation.system.dto;

public class AdminDashboardResponse {
    private long totalUsers;
    private long totalDonors;
    private long totalRequests;
    private long availableDonors;

    public AdminDashboardResponse() {
    }

    public AdminDashboardResponse(long totalUsers, long totalDonors, long totalRequests, long availableDonors) {
        this.totalUsers = totalUsers;
        this.totalDonors = totalDonors;
        this.totalRequests = totalRequests;
        this.availableDonors = availableDonors;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalDonors() {
        return totalDonors;
    }

    public void setTotalDonors(long totalDonors) {
        this.totalDonors = totalDonors;
    }

    public long getTotalRequests() {
        return totalRequests;
    }

    public void setTotalRequests(long totalRequests) {
        this.totalRequests = totalRequests;
    }

    public long getAvailableDonors() {
        return availableDonors;
    }

    public void setAvailableDonors(long availableDonors) {
        this.availableDonors = availableDonors;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private long totalUsers;
        private long totalDonors;
        private long totalRequests;
        private long availableDonors;

        public Builder totalUsers(long totalUsers) {
            this.totalUsers = totalUsers;
            return this;
        }

        public Builder totalDonors(long totalDonors) {
            this.totalDonors = totalDonors;
            return this;
        }

        public Builder totalRequests(long totalRequests) {
            this.totalRequests = totalRequests;
            return this;
        }

        public Builder availableDonors(long availableDonors) {
            this.availableDonors = availableDonors;
            return this;
        }

        public AdminDashboardResponse build() {
            return new AdminDashboardResponse(totalUsers, totalDonors, totalRequests, availableDonors);
        }
    }
}
