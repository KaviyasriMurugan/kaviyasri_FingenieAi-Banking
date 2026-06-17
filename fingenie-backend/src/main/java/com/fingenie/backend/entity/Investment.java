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
@Table(name = "investments")
@Data
public class Investment {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
 
    private String fundName;
 
    private Double investedAmount;
 
    private Double currentValue;
 
    @Enumerated(EnumType.STRING)
    private RiskLevel riskLevel;
 
    private String category;
 
    private LocalDateTime investedAt = LocalDateTime.now();
 
    public enum RiskLevel {
        LOW, MEDIUM, HIGH
    }
}