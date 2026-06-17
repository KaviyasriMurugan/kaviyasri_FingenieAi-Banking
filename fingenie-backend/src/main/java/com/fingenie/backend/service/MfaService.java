package com.fingenie.backend.service;
 
import com.fingenie.backend.entity.User;
import com.fingenie.backend.repository.UserRepository;
import com.fingenie.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Random;
 
@Service
@RequiredArgsConstructor
public class MfaService {
 
    private final UserRepository userRepository;
 
    public String generateOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found!"));
        String otp = String.format("%06d",
                new Random().nextInt(999999));
        user.setOtpCode(otp);
        userRepository.save(user);
        System.out.println("OTP for " + email + " : " + otp);
        return "OTP generated: " + otp;
    }
 
    public boolean verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found!"));
        if (user.getOtpCode() != null &&
                user.getOtpCode().equals(otp)) {
            user.setOtpCode(null);
            userRepository.save(user);
            return true;
        }
        return false;
    }
}
 