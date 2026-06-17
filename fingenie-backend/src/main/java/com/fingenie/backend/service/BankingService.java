package com.fingenie.backend.service;
 
import java.util.List;
import java.util.Random;

import org.springframework.stereotype.Service;

import com.fingenie.backend.entity.Account;
import com.fingenie.backend.entity.Transaction;
import com.fingenie.backend.entity.User;
import com.fingenie.backend.exception.BadRequestException;
import com.fingenie.backend.exception.ResourceNotFoundException;
import com.fingenie.backend.factory.TransactionFactory;
import com.fingenie.backend.repository.AccountRepository;
import com.fingenie.backend.repository.TransactionRepository;
import com.fingenie.backend.repository.UserRepository;
import com.fingenie.backend.strategy.BasicFraudStrategy;
import com.fingenie.backend.strategy.FraudDetectionStrategy;

import lombok.RequiredArgsConstructor;
 
@Service
@RequiredArgsConstructor
public class BankingService implements IBankingService {
 
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final TransactionFactory transactionFactory; 
 
    private FraudDetectionStrategy fraudStrategy =
            new BasicFraudStrategy();
 
    private static final Double SINGLE_TRANSACTION_LIMIT = 5000000.0;
 
    public void setFraudStrategy(FraudDetectionStrategy strategy) {
        this.fraudStrategy = strategy;
    }
 
    @Override
    public Account createAccount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found!"));
        Account account = new Account();
        account.setUser(user);
        account.setAccountNumber(generateAccountNumber());
        account.setBalance(0.0);
        return accountRepository.save(account);
    }
 
    @Override
    public Account getAccount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found!"));
        List<Account> accounts = accountRepository.findByUser(user);
        if (accounts.isEmpty())
            throw new ResourceNotFoundException("No account found!");
        return accounts.get(0);
    }
 
    @Override
    public Transaction deposit(String email, Double amount) {
        if (amount <= 0)
            throw new BadRequestException(
                    "Amount must be positive!");
        if (amount > SINGLE_TRANSACTION_LIMIT)
            throw new BadRequestException(
                    "Single transaction limit is Rs.2,00,000!");
 
        Account account = getAccount(email);
        account.setBalance(account.getBalance() + amount);
        accountRepository.save(account);
 
        double riskScore = fraudStrategy.calculateRiskScore(
                amount, "DEPOSIT");
        String category = categorizeTransaction(
                amount, Transaction.TransactionType.DEPOSIT);
 
        Transaction transaction = transactionFactory
                .createDepositTransaction(account, amount,
                        riskScore, category);
        transaction.setFraudulent(
                fraudStrategy.isFraudulent(riskScore));
        return transactionRepository.save(transaction);
    }
 
    @Override
    public Transaction withdraw(String email, Double amount) {
        if (amount <= 0)
            throw new BadRequestException(
                    "Amount must be positive!");
        if (amount > SINGLE_TRANSACTION_LIMIT)
            throw new BadRequestException(
                    "Single transaction limit is Rs.1,00,0000!");
 
        Account account = getAccount(email);
        if (account.getBalance() < amount)
            throw new BadRequestException("Insufficient balance!");
        if (account.getBalance() - amount < 0)
            throw new BadRequestException(
                    "Balance cannot go below zero!");
 
        account.setBalance(account.getBalance() - amount);
        accountRepository.save(account);
 
        double riskScore = fraudStrategy.calculateRiskScore(
                amount, "WITHDRAWAL");
        String category = categorizeTransaction(
                amount, Transaction.TransactionType.WITHDRAWAL);
 
        Transaction transaction = transactionFactory
                .createWithdrawalTransaction(account, amount,
                        riskScore, category);
        transaction.setFraudulent(
                fraudStrategy.isFraudulent(riskScore));
        return transactionRepository.save(transaction);
    }
 
    @Override
    public Transaction transfer(String fromEmail,
            String toAccountNumber, Double amount) {
        if (amount <= 0)
            throw new BadRequestException(
                    "Amount must be positive!");
        if (amount > SINGLE_TRANSACTION_LIMIT)
            throw new BadRequestException(
                    "Single transaction limit is Rs.1,00,0000!");
 
        Account fromAccount = getAccount(fromEmail);
        if (fromAccount.getBalance() < amount)
            throw new BadRequestException("Insufficient balance!");
        if (fromAccount.getBalance() - amount < 0)
            throw new BadRequestException(
                    "Balance cannot go below zero!");
 
        Account toAccount = accountRepository
                .findByAccountNumber(toAccountNumber)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Recipient account not found!"));
 
        fromAccount.setBalance(fromAccount.getBalance() - amount);
        toAccount.setBalance(toAccount.getBalance() + amount);
        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);
 
        double riskScore = fraudStrategy.calculateRiskScore(
                amount, "TRANSFER");
 
        Transaction senderTransaction = transactionFactory
                .createTransferTransaction(fromAccount, amount,
                        toAccountNumber, riskScore);
        senderTransaction.setFraudulent(
                fraudStrategy.isFraudulent(riskScore));
        transactionRepository.save(senderTransaction);
 
        Transaction receiverTransaction = new Transaction();
        receiverTransaction.setAccount(toAccount);
        receiverTransaction.setAmount(amount);
        receiverTransaction.setType(
                Transaction.TransactionType.DEPOSIT);
        receiverTransaction.setDescription(
                "Received from " +
                fromAccount.getAccountNumber());
        receiverTransaction.setRiskScore(0.1);
        receiverTransaction.setCategory("TRANSFER");
        transactionRepository.save(receiverTransaction);
 
        return senderTransaction;
    }
 
    @Override
    public List<Transaction> getTransactions(String email) {
        Account account = getAccount(email);
        return transactionRepository
                .findByAccountOrderByTransactionDateDesc(account);
    }
 
    private String categorizeTransaction(Double amount,
            Transaction.TransactionType type) {
        if (type == Transaction.TransactionType.DEPOSIT) {
            if (amount >= 50000) return "SALARY";
            if (amount >= 10000) return "BUSINESS";
            return "PERSONAL";
        }
        if (type == Transaction.TransactionType.WITHDRAWAL) {
            if (amount >= 20000) return "RENT";
            if (amount >= 5000) return "SHOPPING";
            return "FOOD";
        }
        return "TRANSFER";
    }
 
    private String generateAccountNumber() {
        return "FG" + (1000000000L +
                new Random().nextInt(900000000));
    }
}
 