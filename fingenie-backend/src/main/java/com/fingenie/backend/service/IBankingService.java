package com.fingenie.backend.service;
 
import com.fingenie.backend.entity.Account;
import com.fingenie.backend.entity.Transaction;
import java.util.List;
 
public interface IBankingService {
    Account createAccount(String email);
    Account getAccount(String email);
    Transaction deposit(String email, Double amount);
    Transaction withdraw(String email, Double amount);
    Transaction transfer(String fromEmail,
            String toAccountNumber, Double amount);
    List<Transaction> getTransactions(String email);
}