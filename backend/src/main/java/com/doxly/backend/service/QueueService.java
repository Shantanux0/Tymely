package com.doxly.backend.service;

import com.doxly.backend.dto.QueuePatientDTO;
import java.util.List;
import java.util.Map;

public interface QueueService {
    List<QueuePatientDTO> getQueue();
    Map<String, Object> addPatientToQueue(String name, String phone, Integer age, String gender, String reason, Double fees);
    void markPatientDone(String id, Double customAmount);
    void skipPatient(String id);
    void reschedulePatient(String id);
    void removePatient(String id);
    void resetQueue();
    void callPatient(String id);
    List<QueuePatientDTO> getLiveQueueForGuest(String code);
}
