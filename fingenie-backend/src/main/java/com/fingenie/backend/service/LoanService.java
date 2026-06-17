package com.fingenie.backend.service;
 
import java.util.List;

import org.springframework.stereotype.Service;

import com.fingenie.backend.entity.LoanApplication;
import com.fingenie.backend.entity.User;
import com.fingenie.backend.exception.BadRequestException;
import com.fingenie.backend.exception.ResourceNotFoundException;
import com.fingenie.backend.repository.LoanRepository;
import com.fingenie.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
 
@Service
@RequiredArgsConstructor
public class LoanService implements ILoanService {
 
    private final LoanRepository loanRepository;
    private final UserRepository userRepository;
 
    @Override
    public LoanApplication applyLoan(String email, Double amount,
            Integer tenure, Double income,
            Double creditScore, String employmentType) {
 
        if (amount <= 0)
            throw new BadRequestException(
                    "Loan amount must be positive!");
        if (creditScore < 300 || creditScore > 900)
            throw new BadRequestException(
                    "Credit score must be between 300 and 900!");
        if (income <= 0)
            throw new BadRequestException(
                    "Income must be positive!");
        if (tenure <= 0 || tenure > 360)
            throw new BadRequestException(
                    "Tenure must be between 1 and 360 months!");
 
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found!"));
 
        LoanApplication loan = new LoanApplication();
        loan.setUser(user);
        loan.setLoanAmount(amount);
        loan.setTenureMonths(tenure);
        loan.setAnnualIncome(income);
        loan.setCreditScore(creditScore);
        loan.setEmploymentType(employmentType);
 
        double probability = predictLoanApproval(
                creditScore, income, amount);
        loan.setApprovalProbability(probability);
 
        if (probability >= 0.6) {
            loan.setStatus(LoanApplication.LoanStatus.APPROVED);
        } else {
            loan.setStatus(LoanApplication.LoanStatus.REJECTED);
        }
 
        return loanRepository.save(loan);
    }
 
    @Override
    public List<LoanApplication> getUserLoans(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found!"));
        return loanRepository.findByUser(user);
    }
 
    @Override
    public Double calculateEMI(Double amount,
            Integer tenure, Double rate) {
        if (amount <= 0 || tenure <= 0 || rate <= 0)
            throw new BadRequestException(
                    "Invalid EMI parameters!");
        double monthlyRate = rate / (12 * 100);
        double emi = (amount * monthlyRate *
                Math.pow(1 + monthlyRate, tenure)) /
                (Math.pow(1 + monthlyRate, tenure) - 1);
        return Math.round(emi * 100.0) / 100.0;
    }
 
    private double predictLoanApproval(Double creditScore,
            Double income, Double loanAmount) {
        double score = 0.0;
 
        if (creditScore >= 800) score += 0.4;
        else if (creditScore >= 750) score += 0.35;
        else if (creditScore >= 700) score += 0.25;
        else if (creditScore >= 650) score += 0.15;
        else if (creditScore >= 600) score += 0.05;
        else score += 0.0;
 
        double ratio = income / loanAmount;
        if (ratio >= 5) score += 0.3;
        else if (ratio >= 3) score += 0.2;
        else if (ratio >= 2) score += 0.1;
        else score += 0.0;
 
        if (income >= 1000000) score += 0.2;
        else if (income >= 500000) score += 0.15;
        else if (income >= 300000) score += 0.1;
        else score += 0.0;
 
        if (loanAmount <= 500000) score += 0.1;
        else if (loanAmount <= 1000000) score += 0.05;
        else score += 0.0;
 
        return Math.min(score, 1.0);
    }
}
 