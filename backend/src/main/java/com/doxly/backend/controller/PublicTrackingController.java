package com.doxly.backend.controller;

import com.doxly.backend.dto.QueuePatientDTO;
import com.doxly.backend.service.QueueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/public/track")
public class PublicTrackingController {

    @Autowired
    private QueueService queueService;

    @GetMapping("/{code}")
    public ResponseEntity<List<QueuePatientDTO>> getLiveQueueForGuest(@PathVariable String code) {
        try {
            List<QueuePatientDTO> queue = queueService.getLiveQueueForGuest(code);
            return ResponseEntity.ok(queue);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
