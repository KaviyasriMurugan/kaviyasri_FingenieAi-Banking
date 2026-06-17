package com.fingenie.backend.controller;
 
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fingenie.backend.entity.Account;
import com.fingenie.backend.entity.Transaction;
import com.fingenie.backend.entity.User;
import com.fingenie.backend.exception.ResourceNotFoundException;
import com.fingenie.backend.repository.AccountRepository;
import com.fingenie.backend.repository.TransactionRepository;
import com.fingenie.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
 
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3005"})
public class AdminController {
 
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
 
    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userRepository.findAll()
                .stream()
                .filter(u -> u.getRole() == User.Role.CUSTOMER)
                .collect(Collectors.toList());
 
        List<Map<String, Object>> result = users.stream().map(user -> {
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("fullName", user.getFullName());
            userData.put("email", user.getEmail());
            userData.put("role", user.getRole());
            userData.put("createdAt", user.getCreatedAt());
 
            List<Account> accounts = accountRepository.findByUser(user);
            if (!accounts.isEmpty()) {
                Account account = accounts.get(0);
                userData.put("accountNumber", account.getAccountNumber());
                userData.put("balance", account.getBalance());
 
                LocalDateTime today = LocalDateTime.now()
                        .withHour(0).withMinute(0).withSecond(0);
 
                List<Transaction> allTx = transactionRepository
                        .findByAccountOrderByTransactionDateDesc(account);
 
                List<Transaction> todayTx = allTx.stream()
                        .filter(tx -> tx.getTransactionDate() != null &&
                                tx.getTransactionDate().isAfter(today))
                        .collect(Collectors.toList());
 
                userData.put("todayTransactions", todayTx.size());
                userData.put("totalTransactions", allTx.size());
 
                double todayDeposit = todayTx.stream()
                        .filter(tx -> tx.getType() ==
                                Transaction.TransactionType.DEPOSIT)
                        .mapToDouble(Transaction::getAmount)
                        .sum();
 
                double todayWithdraw = todayTx.stream()
                        .filter(tx -> tx.getType() ==
                                Transaction.TransactionType.WITHDRAWAL)
                        .mapToDouble(Transaction::getAmount)
                        .sum();
 
                double todayTransfer = todayTx.stream()
                        .filter(tx -> tx.getType() ==
                                Transaction.TransactionType.TRANSFER)
                        .mapToDouble(Transaction::getAmount)
                        .sum();
 
                long fraudCount = allTx.stream()
                        .filter(Transaction::isFraudulent)
                        .count();
 
                userData.put("todayDeposit", todayDeposit);
                userData.put("todayWithdraw", todayWithdraw);
                userData.put("todayTransfer", todayTransfer);
                userData.put("fraudCount", fraudCount);
 
            } else {
                userData.put("accountNumber", "No Account");
                userData.put("balance", 0.0);
                userData.put("todayTransactions", 0);
                userData.put("totalTransactions", 0);
                userData.put("todayDeposit", 0.0);
                userData.put("todayWithdraw", 0.0);
                userData.put("todayTransfer", 0.0);
                userData.put("fraudCount", 0);
            }
            return userData;
        }).collect(Collectors.toList());
 
        return ResponseEntity.ok(result);
    }
 
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
 
        long totalUsers = userRepository.findAll()
                .stream()
                .filter(u -> u.getRole() == User.Role.CUSTOMER)
                .count();
 
        stats.put("totalUsers", totalUsers);
        stats.put("totalAccounts", accountRepository.findAll().size());
        stats.put("totalTransactions",
                transactionRepository.findAll().size());
        stats.put("fraudAlerts",
                transactionRepository.findByIsFraudulentTrue().size());
 
        double totalBalance = accountRepository.findAll()
                .stream()
                .mapToDouble(Account::getBalance)
                .sum();
        stats.put("totalBalance", totalBalance);
 
        return ResponseEntity.ok(stats);
    }
 
    @GetMapping("/customer/{email}/transactions")
    public ResponseEntity<List<Transaction>> getCustomerTransactions(
            @PathVariable String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found!"));
        List<Account> accounts = accountRepository.findByUser(user);
        if (accounts.isEmpty())
            return ResponseEntity.ok(List.of());
        return ResponseEntity.ok(
                transactionRepository
                .findByAccountOrderByTransactionDateDesc(
                        accounts.get(0)));
    }
}
 