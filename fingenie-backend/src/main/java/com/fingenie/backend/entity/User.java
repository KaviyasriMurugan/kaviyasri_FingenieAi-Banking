package com.fingenie.backend.entity;
 
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
 

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
@Data
public class User {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @Column(unique = true, nullable = false)
    private String email;
 
    @Column(nullable = false)
    private String password;
 
    @Column(nullable = false)
    private String fullName;
 
    @Enumerated(EnumType.STRING)
    private Role role = Role.CUSTOMER;
 
    private boolean enabled = true;
 
    private LocalDateTime createdAt = LocalDateTime.now();
 
    public enum Role {
        CUSTOMER, ADMIN
    }
    private String otpCode;
 
private boolean mfaEnabled = false;
 
public String getOtpCode() {
    return otpCode;
}
 
public void setOtpCode(String otpCode) {
    this.otpCode = otpCode;
}
 
public boolean isMfaEnabled() {
    return mfaEnabled;
}
 
public void setMfaEnabled(boolean mfaEnabled) {
    this.mfaEnabled = mfaEnabled;
}
 
}