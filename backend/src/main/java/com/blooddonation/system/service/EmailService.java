package com.blooddonation.system.service;

public interface EmailService {
    void sendNotificationEmail(String recipientEmail, String subject, String body);
}
