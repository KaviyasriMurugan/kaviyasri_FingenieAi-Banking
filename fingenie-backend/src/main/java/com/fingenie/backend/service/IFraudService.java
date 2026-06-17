package com.fingenie.backend.service;
 
import com.fingenie.backend.entity.Transaction;
import java.util.List;
 
public interface IFraudService {
    List<Transaction> getFraudulentTransactions();
    Transaction analyzeTransaction(Long transactionId);
    Double getRiskScore(Double amount, String type);
}