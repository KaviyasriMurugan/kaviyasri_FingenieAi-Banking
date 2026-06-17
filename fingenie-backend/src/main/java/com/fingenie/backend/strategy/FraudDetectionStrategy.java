package com.fingenie.backend.strategy;
 
public interface FraudDetectionStrategy {
    double calculateRiskScore(Double amount, String transactionType);
    boolean isFraudulent(double riskScore);
}