package com.fingenie.backend.controller;
 
import java.security.cert.X509Certificate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
 
@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3005"})
public class ChatController {
 
    private String geminiApiKey = "YOUR_API_KEY";
 
    @PostMapping("/ask")
    public ResponseEntity<Map> askGemini(
            @RequestBody Map<String, String> request) {
 
        String userMessage = request.get("message");
        String prompt = "You are FinGenie, an AI banking assistant. " +
                "Answer banking and finance questions helpfully " +
                "and concisely. Question: " + userMessage;
 
        try {
            TrustManager[] trustAllCerts = new TrustManager[]{
                new X509TrustManager() {
                    public X509Certificate[] getAcceptedIssuers() {
                        return null;
                    }
                    public void checkClientTrusted(
                            X509Certificate[] certs, String authType) {}
                    public void checkServerTrusted(
                            X509Certificate[] certs, String authType) {}
                }
            };
 
            SSLContext sc = SSLContext.getInstance("SSL");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
            HttpsURLConnection.setDefaultSSLSocketFactory(
                    sc.getSocketFactory());
            HttpsURLConnection.setDefaultHostnameVerifier(
                    (hostname, session) -> true);
 
            RestTemplate restTemplate = new RestTemplate();
 
            String url = "https://generativelanguage.googleapis.com" +
                    "/v1beta/models/gemini-2.0-flash:generateContent?key="
                    + geminiApiKey;
 
            Map<String, Object> part = new HashMap<>();
            part.put("text", prompt);
 
            Map<String, Object> content = new HashMap<>();
            content.put("parts", List.of(part));
 
            Map<String, Object> body = new HashMap<>();
            body.put("contents", List.of(content));
 
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity =
                    new HttpEntity<>(body, headers);
 
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    url, entity, Map.class);
 
            return ResponseEntity.ok(response.getBody());
 
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.ok(error);
        }
    }
}
 
