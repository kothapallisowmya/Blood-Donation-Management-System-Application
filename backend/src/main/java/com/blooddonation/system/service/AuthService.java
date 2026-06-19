package com.blooddonation.system.service;

import com.blooddonation.system.dto.LoginRequest;
import com.blooddonation.system.dto.LoginResponse;
import com.blooddonation.system.dto.MessageResponse;
import com.blooddonation.system.dto.RegisterRequest;

public interface AuthService {
    MessageResponse registerUser(RegisterRequest request);
    LoginResponse loginUser(LoginRequest request);
}
