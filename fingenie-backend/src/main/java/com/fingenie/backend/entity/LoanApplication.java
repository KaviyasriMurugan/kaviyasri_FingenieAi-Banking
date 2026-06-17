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
@Table(name = "loan_applications")
@Data
public class LoanApplication {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
 
    private Double loanAmount;
 
    private Integer tenureMonths;
 
    private Double annualIncome;
 
    private Double creditScore;
 
    private String employmentType;
 
    @Enumerated(EnumType.STRING)
    private LoanStatus status = LoanStatus.PENDING;
 
    private Double approvalProbability;
 
    private LocalDateTime appliedAt = LocalDateTime.now();
 
    public enum LoanStatus {
        PENDING, APPROVED, REJECTED
    }
}