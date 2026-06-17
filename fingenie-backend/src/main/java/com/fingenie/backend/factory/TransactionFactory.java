package com.fingenie.backend.factory;
 
import com.fingenie.backend.entity.Account;
import com.fingenie.backend.entity.Transaction;
import org.springframework.stereotype.Component;
 
@Component
public class TransactionFactory {
 
    public Transaction createTransaction(Account account,
            Double amount, Transaction.TransactionType type,
            String description, Double riskScore, String category) {
 
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setAmount(amount);
        transaction.setType(type);
        transaction.setDescription(description);
        transaction.setRiskScore(riskScore);
        transaction.setCategory(category);
        return transaction;
    }
 
    public Transaction createDepositTransaction(
            Account account, Double amount,
            Double riskScore, String category) {
        return createTransaction(account, amount,
                Transaction.TransactionType.DEPOSIT,
                "Deposit", riskScore, category);
    }
 
    public Transaction createWithdrawalTransaction(
            Account account, Double amount,
                Double riskScore, String category) {
        return createTransaction(account, amount,
                Transaction.TransactionType.WITHDRAWAL,
                "Withdrawal", riskScore, category);
    }
 
    public Transaction createTransferTransaction(
            Account account, Double amount,
            String toAccountNumber, Double riskScore) {
        return createTransaction(account, amount,
                Transaction.TransactionType.TRANSFER,
                "Transfer to " + toAccountNumber,
                riskScore, "TRANSFER");
    }
}
 