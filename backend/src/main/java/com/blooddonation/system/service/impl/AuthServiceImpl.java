package com.blooddonation.system.service.impl;

import com.blooddonation.system.dto.LoginRequest;
import com.blooddonation.system.dto.LoginResponse;
import com.blooddonation.system.dto.MessageResponse;
import com.blooddonation.system.dto.RegisterRequest;
import com.blooddonation.system.entity.User;
import com.blooddonation.system.exception.DuplicateEmailException;
import com.blooddonation.system.exception.InvalidCredentialsException;
import com.blooddonation.system.repository.UserRepository;
import com.blooddonation.system.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(UserRepository userRepository,
                            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public MessageResponse registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email address is already in use");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .role(request.getRole())
                .active(true)
                .build();

        userRepository.save(user);

        return new MessageResponse("User registered successfully");
    }

    @Override
    @Transactional(readOnly = true)
    public LoginResponse loginUser(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        return LoginResponse.builder()
                .token("DISABLED")
                .role(user.getRole())
                .email(user.getEmail())
                .userId(user.getId())
                .build();
    }
}
