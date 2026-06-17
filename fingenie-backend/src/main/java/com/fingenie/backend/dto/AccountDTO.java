package com.fingenie.dto;
 
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
 
@Data
public class AccountDTO {
 
    @NotNull(message = "Email is required")
    private String email;
 
    @NotNull(message = "Account type is required")
    private String accountType;
 
    @Positive(message = "Balance must be positive")
    private Double balance;
}