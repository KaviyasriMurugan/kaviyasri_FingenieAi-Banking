package com.fingenie.backend.controller;
 
import com.fingenie.backend.entity.Transaction;
import com.fingenie.backend.service.FraudService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
 
@RestController
@RequestMapping("/api/fraud")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class FraudController {
 
    private final FraudService fraudService;
 
    @GetMapping("/alerts")
    public ResponseEntity<List<Transaction>> getFraudAlerts() {
        return ResponseEntity.ok(fraudService.getFraudulentTransactions());
    }
 
    @PostMapping("/analyze/{transactionId}")
    public ResponseEntity<Transaction> analyzeTransaction(
            @PathVariable Long transactionId) {
        return ResponseEntity.ok(fraudService.analyzeTransaction(transactionId));
    }
 
    @PostMapping("/risk-score")
    public ResponseEntity<Double> getRiskScore(
            @RequestBody Map<String, Object> request) {
        Double amount = Double.valueOf(request.get("amount").toString());
        String type = (String) request.get("type");
        return ResponseEntity.ok(fraudService.getRiskScore(amount, type));
    }
}
 