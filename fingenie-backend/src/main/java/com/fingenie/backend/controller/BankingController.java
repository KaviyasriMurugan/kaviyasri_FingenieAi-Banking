package com.fingenie.backend.controller;
 
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fingenie.backend.entity.Account;
import com.fingenie.backend.entity.Transaction;
import com.fingenie.backend.service.BankingService;

import lombok.RequiredArgsConstructor;
 
@RestController
@RequestMapping("/api/banking")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class BankingController {
 
    private final BankingService bankingService;
 
    @PostMapping("/account/create")
    public ResponseEntity<Account> createAccount(@RequestParam String email) {
        return ResponseEntity.ok(bankingService.createAccount(email));
    }
 
    @GetMapping("/account")
    public ResponseEntity<Account> getAccount(@RequestParam String email) {
        return ResponseEntity.ok(bankingService.getAccount(email));
    }
 
    @PostMapping("/deposit")
    public ResponseEntity<Transaction> deposit(@RequestBody Map<String, Object> request) {
        String email = (String) request.get("email");
        Double amount = Double.valueOf(request.get("amount").toString());
        return ResponseEntity.ok(bankingService.deposit(email, amount));
    }
 
    @PostMapping("/withdraw")
    public ResponseEntity<Transaction> withdraw(@RequestBody Map<String, Object> request) {
        String email = (String) request.get("email");
        Double amount = Double.valueOf(request.get("amount").toString());
        return ResponseEntity.ok(bankingService.withdraw(email, amount));
    }
 
    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getTransactions(@RequestParam String email) {
        return ResponseEntity.ok(bankingService.getTransactions(email));
    }
    @PostMapping("/transfer")
public ResponseEntity<Transaction> transfer(
        @RequestBody Map<String, Object> request) {
    String email = (String) request.get("email");
    String toAccount = (String) request.get("toAccountNumber");
    Double amount = Double.valueOf(request.get("amount").toString());
    return ResponseEntity.ok(bankingService.transfer(email, toAccount, amount));
}
}
 