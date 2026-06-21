package com.doxly.backend.service;

import com.doxly.backend.dto.EarningItemDTO;
import com.doxly.backend.model.EarningItem;
import com.doxly.backend.repository.EarningItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class EarningsServiceImpl implements EarningsService {

    @Autowired
    private EarningItemRepository earningItemRepository;

    @Autowired
    private ActivityService activityService;

    @Override
    public Map<String, Object> getEarningsBreakdown() {
        List<EarningItem> chartEntities = earningItemRepository.findAll();
        Map<String, Double> valuesMap = chartEntities.stream()
                .collect(Collectors.toMap(EarningItem::getDay, EarningItem::getValue, (v1, v2) -> v1));

        List<String> daysOrder = Arrays.asList("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun");
        List<EarningItemDTO> chart = new ArrayList<>();
        for (String day : daysOrder) {
            chart.add(new EarningItemDTO(day, valuesMap.getOrDefault(day, 0.0)));
        }

        double totalEarnings = chart.stream().mapToDouble(EarningItemDTO::getValue).sum();
        double consultation = totalEarnings * 0.60;
        double procedures = totalEarnings * 0.27;
        double followUps = totalEarnings * 0.13;

        List<Map<String, Object>> breakdown = new ArrayList<>();
        breakdown.add(Map.of("label", "Consultation", "value", Math.round(consultation), "color", "#52B788"));
        breakdown.add(Map.of("label", "Procedures", "value", Math.round(procedures), "color", "#2D6A4F"));
        breakdown.add(Map.of("label", "Follow-ups", "value", Math.round(followUps), "color", "#74C69D"));

        Map<String, Object> result = new HashMap<>();
        result.put("earningsChart", chart);
        result.put("earningsBreakdown", breakdown);
        return result;
    }

    @Override
    public void addManualEarning(Double amount, String tokenText) {
        String[] days = {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"};
        String today = days[Calendar.getInstance().get(Calendar.DAY_OF_WEEK) - 1];

        EarningItem e = earningItemRepository.findById(today)
                .orElse(new EarningItem(today, 0.0));
        e.setValue(e.getValue() + amount);
        earningItemRepository.save(e);

        activityService.logActivity("payment", "₹" + Math.round(amount) + " added for consultation (" + tokenText + ")");
    }

    private EarningItemDTO convertToDTO(EarningItem item) {
        return EarningItemDTO.builder()
                .day(item.getDay())
                .value(item.getValue())
                .build();
    }
}
