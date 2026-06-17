package com.fingenie.backend.service;
 
import com.fingenie.backend.entity.Investment;
import com.fingenie.backend.entity.User;
import com.fingenie.backend.repository.InvestmentRepository;
import com.fingenie.backend.repository.UserRepository;
import com.fingenie.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
 
@Service
@RequiredArgsConstructor
public class InvestmentService implements IInvestmentService {
 
    private final InvestmentRepository investmentRepository;
    private final UserRepository userRepository;
 
    @Override
    public Investment addInvestment(String email, String fundName,
            Double amount, String riskLevel, String category) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found!"));
        Investment investment = new Investment();
        investment.setUser(user);
        investment.setFundName(fundName);
        investment.setInvestedAmount(amount);
        investment.setCurrentValue(amount);
        investment.setRiskLevel(Investment.RiskLevel.valueOf(riskLevel));
        investment.setCategory(category);
        return investmentRepository.save(investment);
    }
 
    @Override
    public List<Investment> getUserInvestments(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found!"));
        return investmentRepository.findByUser(user);
    }
 
    @Override
    public Double getTotalPortfolioValue(String email) {
        List<Investment> investments = getUserInvestments(email);
        return investments.stream()
                .mapToDouble(Investment::getCurrentValue)
                .sum();
    }
 
    @Override
    public List<Map<String, String>> getMutualFundSuggestions(
            String riskLevel) {
        List<Map<String, String>> suggestions = new ArrayList<>();
        if (riskLevel.equals("LOW")) {
            suggestions.add(createFund("SBI Liquid Fund",
                    "LOW", "Liquid Fund", "6-7%"));
            suggestions.add(createFund("HDFC Short Term Fund",
                    "LOW", "Debt Fund", "7-8%"));
            suggestions.add(createFund("ICICI Savings Fund",
                    "LOW", "Debt Fund", "6-8%"));
        } else if (riskLevel.equals("MEDIUM")) {
            suggestions.add(createFund("Mirae Asset Balanced Fund",
                    "MEDIUM", "Hybrid Fund", "10-12%"));
            suggestions.add(createFund("HDFC Balanced Advantage",
                    "MEDIUM", "Hybrid Fund", "11-13%"));
            suggestions.add(createFund("Axis Balanced Fund",
                    "MEDIUM", "Hybrid Fund", "10-12%"));
        } else {
            suggestions.add(createFund("Axis Bluechip Fund",
                    "HIGH", "Equity Fund", "14-16%"));
            suggestions.add(createFund("Mirae Asset Large Cap",
                    "HIGH", "Equity Fund", "15-18%"));
            suggestions.add(createFund("Parag Parikh Flexi Cap",
                    "HIGH", "Equity Fund", "16-20%"));
        }
        return suggestions;
    }
 
    @Override
    public Map<String, Object> getSavingsRecommendation(String email) {
        Double portfolioValue = getTotalPortfolioValue(email);
        Map<String, Object> recommendation = new HashMap<>();
        if (portfolioValue < 10000) {
            recommendation.put("message",
                "Start with SIP of Rs.500 per month in liquid funds");
            recommendation.put("suggestedSIP", "500");
            recommendation.put("riskProfile", "LOW");
        } else if (portfolioValue < 100000) {
            recommendation.put("message",
                "Diversify with balanced funds. SIP of Rs.2000/month recommended");
            recommendation.put("suggestedSIP", "2000");
            recommendation.put("riskProfile", "MEDIUM");
        } else {
            recommendation.put("message",
                "Strong portfolio! Consider equity funds for higher returns");
            recommendation.put("suggestedSIP", "5000");
            recommendation.put("riskProfile", "HIGH");
        }
        recommendation.put("currentPortfolioValue", portfolioValue);
        return recommendation;
    }
 
    private Map<String, String> createFund(String name,
            String risk, String category, String returns) {
        Map<String, String> fund = new HashMap<>();
        fund.put("name", name);
        fund.put("riskLevel", risk);
        fund.put("category", category);
        fund.put("expectedReturns", returns);
        return fund;
    }
}