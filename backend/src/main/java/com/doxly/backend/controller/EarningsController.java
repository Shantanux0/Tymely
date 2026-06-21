package com.doxly.backend.controller;

import com.doxly.backend.service.EarningsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/earnings")
public class EarningsController {

    @Autowired
    private EarningsService earningsService;

    @GetMapping
    public ResponseEntity<?> getEarnings() {
        return ResponseEntity.ok(earningsService.getEarningsBreakdown());
    }

    @PostMapping("/manual")
    public ResponseEntity<?> addManualEarning(@RequestBody Map<String, Object> request) {
        Double amount = Double.parseDouble(request.get("amount").toString());
        String tokenText = (String) request.get("tokenText");

        earningsService.addManualEarning(amount, tokenText);
        return ResponseEntity.ok(Map.of("message", "Earning added successfully"));
    }
}
