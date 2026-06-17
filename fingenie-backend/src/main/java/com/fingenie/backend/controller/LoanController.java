package com.fingenie.backend.controller;
 
import com.fingenie.backend.entity.LoanApplication;
import com.fingenie.backend.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
 
@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class LoanController {
 
    private final LoanService loanService;
 
    @PostMapping("/apply")
    public ResponseEntity<LoanApplication> applyLoan(
            @RequestBody Map<String, Object> request) {
        String email = (String) request.get("email");
        Double amount = Double.valueOf(request.get("loanAmount").toString());
        Integer tenure = Integer.valueOf(request.get("tenureMonths").toString());
        Double income = Double.valueOf(request.get("annualIncome").toString());
        Double creditScore = Double.valueOf(request.get("creditScore").toString());
        String employmentType = (String) request.get("employmentType");
 
        return ResponseEntity.ok(loanService.applyLoan(
                email, amount, tenure, income, creditScore, employmentType));
    }
 
    @GetMapping("/my-loans")
    public ResponseEntity<List<LoanApplication>> getMyLoans(
            @RequestParam String email) {
        return ResponseEntity.ok(loanService.getUserLoans(email));
    }
 
    @GetMapping("/emi-calculator")
    public ResponseEntity<Double> calculateEMI(
            @RequestParam Double amount,
            @RequestParam Integer tenure,
            @RequestParam Double rate) {
        return ResponseEntity.ok(loanService.calculateEMI(amount, tenure, rate));
    }
}
 