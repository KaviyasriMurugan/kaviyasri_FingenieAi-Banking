package com.fingenie.backend.service;
 
import com.fingenie.backend.entity.Investment;
import java.util.List;
import java.util.Map;
 
public interface IInvestmentService {
    Investment addInvestment(String email, String fundName,
            Double amount, String riskLevel, String category);
    List<Investment> getUserInvestments(String email);
    Double getTotalPortfolioValue(String email);
    List<Map<String, String>> getMutualFundSuggestions(String riskLevel);
    Map<String, Object> getSavingsRecommendation(String email);
}