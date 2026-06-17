package com.fingenie.backend.strategy;
 
import org.springframework.stereotype.Component;
 
@Component
public class AdvancedFraudStrategy implements FraudDetectionStrategy {
 
    @Override
    public double calculateRiskScore(Double amount, String type) {
        double score = 0.0;
        if (amount > 100000) score += 0.6;
        else if (amount > 50000) score += 0.4;
        else if (amount > 10000) score += 0.2;
        else score += 0.05;
        if (type.equals("WITHDRAWAL")) score += 0.25;
        if (type.equals("TRANSFER")) score += 0.15;
        if (amount % 1000 == 0 && amount > 10000) score += 0.1;
        return Math.min(score, 1.0);
    }
 
    @Override
    public boolean isFraudulent(double riskScore) {
        return riskScore >= 0.7;
    }
}
 