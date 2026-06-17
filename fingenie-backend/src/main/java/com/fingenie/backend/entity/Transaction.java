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
@Table(name = "transactions")
@Data
public class Transaction {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;
 
    private Double amount;
 
    @Enumerated(EnumType.STRING)
    private TransactionType type;
 
    private String description;
 
    private String category;
 
    private boolean isFraudulent = false;
 
    private Double riskScore = 0.0;
 
    private LocalDateTime transactionDate = LocalDateTime.now();
 
    public enum TransactionType {
        DEPOSIT, WITHDRAWAL, TRANSFER
    }
}