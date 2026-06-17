package com.fingenie.dto;
 
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
 
@Data
public class InvestmentDTO {
 
    @NotNull(message = "Email is required")
    private String email;
 
    @NotBlank(message = "Fund name is required")
    private String fundName;
 
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;
 
    @NotNull(message = "Risk level is required")
    private String riskLevel;
 
    @NotBlank(message = "Category is required")
    private String category;
}
 