package com.fingenie.backend.service;
 
import com.fingenie.backend.entity.Transaction;
import com.fingenie.backend.repository.TransactionRepository;
import com.fingenie.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
 
@Service
@RequiredArgsConstructor
public class FraudService implements IFraudService {
 
    private final TransactionRepository transactionRepository;
 
    @Override
    public List<Transaction> getFraudulentTransactions() {
        return transactionRepository.findByIsFraudulentTrue();
    }
 
    @Override
    public Transaction analyzeTransaction(Long transactionId) {
        Transaction transaction = transactionRepository
                .findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Transaction not found!"));
        if (transaction.getRiskScore() >= 0.7) {
            transaction.setFraudulent(true);
        }
        return transactionRepository.save(transaction);
    }
 
    @Override
    public Double getRiskScore(Double amount, String type) {
        double score = 0.0;
        if (amount > 100000) score += 0.6;
        else if (amount > 50000) score += 0.5;
        else if (amount > 10000) score += 0.3;
        else if (amount > 1000) score += 0.1;
        else score += 0.05;
        if (type.equals("WITHDRAWAL")) score += 0.2;
        if (type.equals("TRANSFER")) score += 0.15;
        if (type.equals("DEPOSIT")) score += 0.05;
        return Math.min(score, 1.0);
    }
}
 