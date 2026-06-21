package com.doxly.backend.controller;

import com.doxly.backend.dto.AddPatientRequest;
import com.doxly.backend.dto.QueuePatientDTO;
import com.doxly.backend.service.QueueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/queue")
public class QueueController {

    @Autowired
    private QueueService queueService;

    @GetMapping
    public ResponseEntity<List<QueuePatientDTO>> getQueue() {
        return ResponseEntity.ok(queueService.getQueue());
    }

    @PostMapping
    public ResponseEntity<?> addPatientToQueue(@RequestBody AddPatientRequest request) {
        Map<String, Object> response = queueService.addPatientToQueue(
                request.getName(),
                request.getPhone(),
                request.getAge(),
                request.getGender(),
                request.getReason(),
                request.getFees()
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/done")
    public ResponseEntity<?> markPatientDone(@PathVariable String id, @RequestBody(required = false) Map<String, Object> request) {
        Double customAmount = null;
        if (request != null && request.containsKey("customAmount")) {
            customAmount = Double.parseDouble(request.get("customAmount").toString());
        }

        queueService.markPatientDone(id, customAmount);
        return ResponseEntity.ok(Map.of("message", "Patient marked done successfully"));
    }

    @PostMapping("/{id}/skip")
    public ResponseEntity<?> skipPatient(@PathVariable String id) {
        queueService.skipPatient(id);
        return ResponseEntity.ok(Map.of("message", "Patient skipped successfully"));
    }

    @PostMapping("/{id}/reschedule")
    public ResponseEntity<?> reschedulePatient(@PathVariable String id) {
        queueService.reschedulePatient(id);
        return ResponseEntity.ok(Map.of("message", "Patient rescheduled successfully"));
    }

    @PostMapping("/{id}/remove")
    public ResponseEntity<?> removePatient(@PathVariable String id) {
        queueService.removePatient(id);
        return ResponseEntity.ok(Map.of("message", "Patient removed from queue successfully"));
    }

    @PostMapping("/reset")
    public ResponseEntity<?> resetQueue() {
        queueService.resetQueue();
        return ResponseEntity.ok(Map.of("message", "Queue reset successfully"));
    }

    @PostMapping("/{id}/call")
    public ResponseEntity<?> callPatient(@PathVariable String id) {
        queueService.callPatient(id);
        return ResponseEntity.ok(Map.of("message", "Called patient successfully"));
    }
}
