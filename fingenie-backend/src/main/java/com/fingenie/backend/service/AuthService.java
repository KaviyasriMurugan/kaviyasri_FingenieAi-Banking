package com.fingenie.backend.service;
 
import com.fingenie.backend.dto.AuthRequest;
import com.fingenie.backend.dto.AuthResponse;
import com.fingenie.backend.entity.User;
import com.fingenie.backend.repository.UserRepository;
import com.fingenie.backend.security.JwtUtil;
import com.fingenie.backend.exception.BadRequestException;
import com.fingenie.backend.exception.ResourceNotFoundException;
import com.fingenie.backend.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Random;
 
@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {
 
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
 
    @Override
    public AuthResponse register(AuthRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists!");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole(User.Role.CUSTOMER);
        userRepository.save(user);
        String token = jwtUtil.generateToken(
            user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getEmail(),
            user.getRole().name(), user.getFullName());
    }
 
    @Override
    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new ResourceNotFoundException(
                "User not found!"));
 
        if (!passwordEncoder.matches(
                request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid password!");
        }
 
        String otp = String.format("%06d", new Random().nextInt(999999));
        user.setOtpCode(otp);
        userRepository.save(user);
        System.out.println("OTP for " + request.getEmail() + " : " + otp);
 
        return new AuthResponse(null, user.getEmail(),
            user.getRole().name(), user.getFullName());
    }
 
    public String resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException(
                "User not found!"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return "Password reset successful!";
    }
}
 