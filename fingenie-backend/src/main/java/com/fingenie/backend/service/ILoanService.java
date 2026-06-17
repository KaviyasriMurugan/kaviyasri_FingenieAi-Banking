package com.fingenie.backend.service;
 
import com.fingenie.backend.entity.LoanApplication;
import java.util.List;
 
public interface ILoanService {
    LoanApplication applyLoan(String email, Double amount,
            Integer tenure, Double income,
            Double creditScore, String employmentType);
    List<LoanApplication> getUserLoans(String email);
    Double calculateEMI(Double amount, Integer tenure, Double rate);
}