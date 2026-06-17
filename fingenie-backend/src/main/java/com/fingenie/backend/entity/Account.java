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
@Table(name = "accounts")
@Data
public class Account {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @Column(unique = true, nullable = false)
    private String accountNumber;
 
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
 
    private Double balance = 0.0;
 
    @Enumerated(EnumType.STRING)
    private AccountType accountType = AccountType.SAVINGS;
 
    private LocalDateTime createdAt = LocalDateTime.now();
 
    public enum AccountType {
        SAVINGS, CURRENT
    }
}