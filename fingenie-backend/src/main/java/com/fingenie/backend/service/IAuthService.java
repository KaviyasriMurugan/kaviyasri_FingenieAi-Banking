package com.fingenie.backend.service;
 
import com.fingenie.backend.dto.AuthRequest;
import com.fingenie.backend.dto.AuthResponse;
 
public interface IAuthService {
    AuthResponse register(AuthRequest request);
    AuthResponse login(AuthRequest request);
}