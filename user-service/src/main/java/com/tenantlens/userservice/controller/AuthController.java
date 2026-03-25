package com.tenantlens.userservice.controller;

import com.tenantlens.userservice.dto.AuthResponse;
import com.tenantlens.userservice.dto.LoginRequest;
import com.tenantlens.userservice.dto.RegisterRequest;
import com.tenantlens.userservice.model.User;
import com.tenantlens.userservice.repository.UserRepository;
import com.tenantlens.userservice.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    // Register endpoint
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    // Get current logged in user - requires JWT token
    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getMe(Principal principal) {
        // Principal contains the email extracted from JWT token by JwtFilter
        String email = principal.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(new AuthResponse(null, user.getEmail(), user.getName()));
    }
}