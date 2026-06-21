package com.doxly.backend.service;

import com.doxly.backend.dto.ActivityItemDTO;
import com.doxly.backend.model.ActivityItem;
import com.doxly.backend.repository.ActivityItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityServiceImpl implements ActivityService {

    @Autowired
    private ActivityItemRepository activityItemRepository;

    @Override
    public List<ActivityItemDTO> getActivityFeed() {
        return activityItemRepository.findTop50ByOrderByTimestampDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void logActivity(String type, String text) {
        String id = "act_" + System.currentTimeMillis();
        ActivityItem activity = ActivityItem.builder()
                .id(id)
                .type(type)
                .text(text)
                .time("Just now")
                .timestamp(LocalDateTime.now())
                .build();
        activityItemRepository.save(activity);
    }

    private ActivityItemDTO convertToDTO(ActivityItem item) {
        return ActivityItemDTO.builder()
                .id(item.getId())
                .type(item.getType())
                .text(item.getText())
                .time(item.getTime())
                .timestamp(item.getTimestamp())
                .build();
    }
}
