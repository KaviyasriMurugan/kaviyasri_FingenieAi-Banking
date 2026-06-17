package com.fingenie.dto;
 
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
 
@Data
public class LoanDTO {
 
    @NotNull(message = "Email is required")
    private String email;
 
    @NotNull(message = "Loan amount is required")
    @Positive(message = "Loan amount must be positive")
    private Double loanAmount;
 
    @NotNull(message = "Tenure is required")
    @Min(value = 1, message = "Tenure must be at least 1 month")
    @Max(value = 360, message = "Tenure cannot exceed 360 months")
    private Integer tenureMonths;
 
    @NotNull(message = "Annual income is required")
    @Positive(message = "Annual income must be positive")
    private Double annualIncome;
 
    @NotNull(message = "Credit score is required")
    @Min(value = 300, message = "Credit score must be at least 300")
    @Max(value = 900, message = "Credit score cannot exceed 900")
    private Double creditScore;
 
    @NotNull(message = "Employment type is required")
    private String employmentType;
}
 