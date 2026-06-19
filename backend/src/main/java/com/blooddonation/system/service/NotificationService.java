package com.blooddonation.system.service;

import com.blooddonation.system.dto.NotificationDto;
import java.util.List;

public interface NotificationService {
    NotificationDto createNotification(Long userId, String message);
    List<NotificationDto> getUserNotifications(Long userId);
    NotificationDto markAsRead(Long notificationId);
    long getUnreadCount(Long userId);
}
