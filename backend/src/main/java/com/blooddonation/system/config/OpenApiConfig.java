package com.blooddonation.system.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "Blood Donation Management System API",
        version = "1.0.0",
        description = "REST APIs for User Registration, Login, Donor Profile Management, and Blood Request Workflows."
    )
)
public class OpenApiConfig {
}
