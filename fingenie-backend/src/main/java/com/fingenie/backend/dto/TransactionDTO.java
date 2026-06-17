package com.fingenie.dto;
 
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
 
@Data
public class TransactionDTO {
 
    @NotNull(message = "Email is required")
    private String email;
 
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;
 
    @NotNull(message = "Transaction type is required")
    private String type;
 
    private String description;
}