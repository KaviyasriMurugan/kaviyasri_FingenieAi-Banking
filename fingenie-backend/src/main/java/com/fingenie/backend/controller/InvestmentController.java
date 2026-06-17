package com.fingenie.backend.controller;
 
import com.fingenie.backend.entity.Investment;
import com.fingenie.backend.service.InvestmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
 
@RestController
@RequestMapping("/api/investments")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3005"})
public class InvestmentController {
 
    private final InvestmentService investmentService;
 
    @PostMapping("/add")
    public ResponseEntity<Investment> addInvestment(
            @RequestBody Map<String, Object> request) {
        String email = (String) request.get("email");
        String fundName = (String) request.get("fundName");
        Double amount = Double.valueOf(request.get("amount").toString());
        String riskLevel = (String) request.get("riskLevel");
        String category = (String) request.get("category");
        return ResponseEntity.ok(investmentService.addInvestment(
                email, fundName, amount, riskLevel, category));
    }
 
    @GetMapping("/my-investments")
    public ResponseEntity<List<Investment>> getMyInvestments(
            @RequestParam String email) {
        return ResponseEntity.ok(
                investmentService.getUserInvestments(email));
    }
 
    @GetMapping("/portfolio-value")
    public ResponseEntity<Double> getPortfolioValue(
            @RequestParam String email) {
        return ResponseEntity.ok(
                investmentService.getTotalPortfolioValue(email));
    }
 
    @GetMapping("/mutual-fund-suggestions")
    public ResponseEntity<List<Map<String, String>>> getMutualFunds(
            @RequestParam String riskLevel) {
        return ResponseEntity.ok(
                investmentService.getMutualFundSuggestions(riskLevel));
    }
 
    @GetMapping("/savings-recommendation")
    public ResponseEntity<Map<String, Object>> getSavingsRecommendation(
            @RequestParam String email) {
        return ResponseEntity.ok(
                investmentService.getSavingsRecommendation(email));
    }
}
