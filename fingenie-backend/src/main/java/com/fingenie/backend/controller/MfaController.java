package com.fingenie.backend.controller;
 
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fingenie.backend.service.MfaService;

import lombok.RequiredArgsConstructor;
 
@RestController
@RequestMapping("/api/mfa")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3005"})
public class MfaController {
 
    private final MfaService mfaService;
 
    @PostMapping("/generate")
    public ResponseEntity<String> generateOtp(
            @RequestParam String email) {
        return ResponseEntity.ok(mfaService.generateOtp(email));
    }
 
    @PostMapping("/verify")
    public ResponseEntity<Boolean> verifyOtp(
            @RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        return ResponseEntity.ok(mfaService.verifyOtp(email, otp));
    }
}