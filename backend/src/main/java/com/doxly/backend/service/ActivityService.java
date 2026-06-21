package com.doxly.backend.service;

import com.doxly.backend.dto.ActivityItemDTO;
import java.util.List;

public interface ActivityService {
    List<ActivityItemDTO> getActivityFeed();
    void logActivity(String type, String text);
}
