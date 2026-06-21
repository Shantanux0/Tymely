package com.doxly.backend.controller;

import com.doxly.backend.dto.ActivityItemDTO;
import com.doxly.backend.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/activity")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @GetMapping
    public ResponseEntity<List<ActivityItemDTO>> getActivityFeed() {
        return ResponseEntity.ok(activityService.getActivityFeed());
    }
}
