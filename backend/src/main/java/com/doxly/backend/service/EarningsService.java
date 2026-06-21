package com.doxly.backend.service;

import java.util.Map;

public interface EarningsService {
    Map<String, Object> getEarningsBreakdown();
    void addManualEarning(Double amount, String tokenText);
}
