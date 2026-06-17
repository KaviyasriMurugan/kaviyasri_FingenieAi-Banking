package com.fingenie.backend.controller;
 
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fingenie.backend.dto.AuthRequest;
import com.fingenie.backend.dto.AuthResponse;
import com.fingenie.backend.entity.User;
import com.fingenie.backend.exception.ResourceNotFoundException;
import com.fingenie.backend.exception.UnauthorizedException;
import com.fingenie.backend.repository.UserRepository;
import com.fingenie.backend.security.JwtUtil;
import com.fingenie.backend.service.AuthService;
import com.fingenie.backend.service.MfaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
 
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3005"})
public class AuthController {
 
    private final AuthService authService;
private final MfaService mfaService;
private final UserRepository userRepository;
private final JwtUtil jwtUtil;
 
 
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
           @Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }
 
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
           @Valid  @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
 
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");
        return ResponseEntity.ok(
                authService.resetPassword(email, newPassword));
    }
    @PostMapping("/verify-otp")
public ResponseEntity<AuthResponse> verifyOtp(
        @RequestBody Map<String, String> request) {
    String email = request.get("email");
    String otp = request.get("otp");
    
    boolean isValid = mfaService.verifyOtp(email, otp);
    
    if (!isValid) {
        throw new UnauthorizedException("Invalid OTP!");
    }
    
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("User not found!"));
    
    String token = jwtUtil.generateToken(
        user.getEmail(), user.getRole().name());
    
    return ResponseEntity.ok(new AuthResponse(token, user.getEmail(),
        user.getRole().name(), user.getFullName()));
}

}
