package com.doxly.backend.service;

import com.doxly.backend.dto.QueuePatientDTO;
import com.doxly.backend.model.EarningItem;
import com.doxly.backend.model.PatientRecord;
import com.doxly.backend.model.QueuePatient;
import com.doxly.backend.repository.EarningItemRepository;
import com.doxly.backend.repository.PatientRecordRepository;
import com.doxly.backend.repository.QueuePatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class QueueServiceImpl implements QueueService {

    @Autowired
    private QueuePatientRepository queuePatientRepository;

    @Autowired
    private PatientRecordRepository patientRecordRepository;

    @Autowired
    private ActivityService activityService;

    @Autowired
    private EarningItemRepository earningItemRepository;

    @Override
    public List<QueuePatientDTO> getQueue() {
        List<QueuePatient> queue = queuePatientRepository.findAll();
        queue.sort(Comparator.comparing(QueuePatient::getToken));
        return queue.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> addPatientToQueue(String name, String phone, Integer age, String gender, String reason, Double fees) {
        List<QueuePatient> allQueue = queuePatientRepository.findAll();
        int nextToken = allQueue.stream()
                .mapToInt(QueuePatient::getToken)
                .max()
                .orElse(0) + 1;

        String trackingCode = UUID.randomUUID().toString().substring(0, 4).toLowerCase();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a");
        String arrivedAt = LocalDateTime.now().format(formatter);

        boolean hasCurrent = allQueue.stream()
                .anyMatch(p -> "current".equals(p.getStatus()));
        String status = hasCurrent ? "waiting" : "current";

        long waitingCount = allQueue.stream()
                .filter(p -> "waiting".equals(p.getStatus()))
                .count();
        int waitMins = (int) (waitingCount * 10);

        QueuePatient newPatient = QueuePatient.builder()
                .id("pat_" + System.currentTimeMillis())
                .token(nextToken)
                .name(name)
                .phone(phone)
                .age(age)
                .gender(gender)
                .reason(reason)
                .arrivedAt(arrivedAt)
                .waitMins(waitMins)
                .status(status)
                .amount(fees)
                .trackingCode(trackingCode)
                .build();

        queuePatientRepository.save(newPatient);

        // Update patient record
        String cleanPhone = phone.replaceAll("\\D", "");
        Optional<PatientRecord> existingRecordOpt = patientRecordRepository.findAll().stream()
                .filter(r -> r.getPhone().replaceAll("\\D", "").equals(cleanPhone))
                .findFirst();

        if (existingRecordOpt.isPresent()) {
            PatientRecord record = existingRecordOpt.get();
            record.setTotalVisits(record.getTotalVisits() + 1);
            record.setLastVisit("Today");
            patientRecordRepository.save(record);
        } else {
            PatientRecord newRecord = PatientRecord.builder()
                    .id("rec_" + System.currentTimeMillis())
                    .name(name)
                    .phone(phone)
                    .age(age)
                    .gender(gender)
                    .lastVisit("Today")
                    .totalVisits(1)
                    .totalPaid(0.0)
                    .tags(new ArrayList<>(Collections.singletonList("New")))
                    .build();
            patientRecordRepository.save(newRecord);
        }

        activityService.logActivity("added", "New patient added: " + name + " (#" + nextToken + ")");

        Map<String, Object> response = new HashMap<>();
        response.put("token", nextToken);
        response.put("trackingCode", trackingCode);
        return response;
    }

    @Override
    public void markPatientDone(String id, Double customAmount) {
        Optional<QueuePatient> patientOpt = queuePatientRepository.findById(id);
        if (patientOpt.isEmpty()) {
            return;
        }

        QueuePatient patient = patientOpt.get();
        patient.setStatus("done");

        Double finalAmount = patient.getAmount();
        if (customAmount != null) {
            finalAmount = customAmount;
            patient.setAmount(finalAmount);
        }

        queuePatientRepository.save(patient);

        // Promote next waiting patient
        List<QueuePatient> allQueue = queuePatientRepository.findAll();
        allQueue.sort(Comparator.comparing(QueuePatient::getToken));
        promoteNextWaiting(allQueue);
        queuePatientRepository.saveAll(allQueue);

        // Update total paid in patient records
        final String cleanPhone = patient.getPhone().replaceAll("\\D", "");
        Optional<PatientRecord> recordOpt = patientRecordRepository.findAll().stream()
                .filter(r -> r.getPhone().replaceAll("\\D", "").equals(cleanPhone))
                .findFirst();

        if (recordOpt.isPresent()) {
            PatientRecord r = recordOpt.get();
            r.setTotalPaid(r.getTotalPaid() + finalAmount);
            patientRecordRepository.save(r);
        }

        // Add to earnings
        String[] days = {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"};
        String today = days[Calendar.getInstance().get(Calendar.DAY_OF_WEEK) - 1];
        EarningItem e = earningItemRepository.findById(today)
                .orElse(new EarningItem(today, 0.0));
        e.setValue(e.getValue() + finalAmount);
        earningItemRepository.save(e);

        activityService.logActivity("done", "Patient " + patient.getName() + " marked done");
    }

    @Override
    public void skipPatient(String id) {
        Optional<QueuePatient> patientOpt = queuePatientRepository.findById(id);
        if (patientOpt.isEmpty()) {
            return;
        }

        QueuePatient patient = patientOpt.get();
        patient.setStatus("skipped");
        queuePatientRepository.save(patient);

        // Promote next waiting patient
        List<QueuePatient> allQueue = queuePatientRepository.findAll();
        allQueue.sort(Comparator.comparing(QueuePatient::getToken));
        promoteNextWaiting(allQueue);
        queuePatientRepository.saveAll(allQueue);

        activityService.logActivity("skipped", "Patient #" + patient.getToken() + " skipped");
    }

    @Override
    public void reschedulePatient(String id) {
        Optional<QueuePatient> patientOpt = queuePatientRepository.findById(id);
        if (patientOpt.isEmpty()) {
            return;
        }

        QueuePatient patient = patientOpt.get();

        List<QueuePatient> allQueue = queuePatientRepository.findAll();
        allQueue.sort(Comparator.comparing(QueuePatient::getToken));

        List<QueuePatient> updatedQueue = allQueue.stream()
                .filter(p -> !p.getId().equals(id))
                .collect(Collectors.toList());

        List<Integer> waitingIndices = new ArrayList<>();
        for (int i = 0; i < updatedQueue.size(); i++) {
            if ("waiting".equals(updatedQueue.get(i).getStatus())) {
                waitingIndices.add(i);
            }
        }

        int targetIndex = waitingIndices.size() > 5 ? waitingIndices.get(5) : updatedQueue.size();

        patient.setStatus("waiting");
        updatedQueue.add(targetIndex, patient);

        promoteNextWaiting(updatedQueue);

        for (int i = 0; i < updatedQueue.size(); i++) {
            updatedQueue.get(i).setToken(i + 1);
        }

        queuePatientRepository.saveAll(updatedQueue);

        activityService.logActivity("rescheduled", "Patient #" + patient.getToken() + " rescheduled");
    }

    @Override
    public void removePatient(String id) {
        Optional<QueuePatient> patientOpt = queuePatientRepository.findById(id);
        if (patientOpt.isEmpty()) {
            return;
        }

        QueuePatient patient = patientOpt.get();
        queuePatientRepository.delete(patient);

        List<QueuePatient> allQueue = queuePatientRepository.findAll();
        allQueue.sort(Comparator.comparing(QueuePatient::getToken));
        promoteNextWaiting(allQueue);
        queuePatientRepository.saveAll(allQueue);

        activityService.logActivity("skipped", "Patient #" + patient.getToken() + " removed");
    }

    @Override
    public void resetQueue() {
        queuePatientRepository.deleteAll();
        activityService.logActivity("rescheduled", "Queue reset successfully");
    }

    @Override
    public void callPatient(String id) {
        Optional<QueuePatient> patientOpt = queuePatientRepository.findById(id);
        if (patientOpt.isEmpty()) {
            return;
        }

        List<QueuePatient> allQueue = queuePatientRepository.findAll();
        for (QueuePatient p : allQueue) {
            if (p.getId().equals(id)) {
                p.setStatus("current");
            } else if ("current".equals(p.getStatus())) {
                p.setStatus("waiting");
            }
        }
        queuePatientRepository.saveAll(allQueue);

        activityService.logActivity("rescheduled", "Called next patient: " + patientOpt.get().getName());
    }

    @Override
    public List<QueuePatientDTO> getLiveQueueForGuest(String code) {
        List<QueuePatient> queue = queuePatientRepository.findAll();

        boolean exists = queue.stream().anyMatch(p -> code.equals(p.getTrackingCode()));
        if (!exists) {
            throw new NoSuchElementException("Tracking code not found");
        }

        return queue.stream()
                .map(p -> {
                    QueuePatientDTO copy = new QueuePatientDTO();
                    copy.setId(p.getId());
                    copy.setToken(p.getToken());
                    copy.setName(p.getName());
                    copy.setAge(p.getAge());
                    copy.setGender(p.getGender());
                    copy.setReason(p.getReason());
                    copy.setArrivedAt(p.getArrivedAt());
                    copy.setWaitMins(p.getWaitMins());
                    copy.setStatus(p.getStatus());
                    copy.setAmount(p.getAmount());
                    copy.setTrackingCode(p.getTrackingCode());

                    String phone = p.getPhone();
                    if (phone != null && phone.length() > 4) {
                        copy.setPhone(phone.substring(0, phone.length() - 4).replaceAll("[0-9]", "*")
                                + phone.substring(phone.length() - 4));
                    } else {
                        copy.setPhone("***");
                    }
                    return copy;
                })
                .collect(Collectors.toList());
    }

    private QueuePatientDTO convertToDTO(QueuePatient patient) {
        return QueuePatientDTO.builder()
                .id(patient.getId())
                .token(patient.getToken())
                .name(patient.getName())
                .phone(patient.getPhone())
                .age(patient.getAge())
                .gender(patient.getGender())
                .reason(patient.getReason())
                .arrivedAt(patient.getArrivedAt())
                .waitMins(patient.getWaitMins())
                .status(patient.getStatus())
                .amount(patient.getAmount())
                .trackingCode(patient.getTrackingCode())
                .build();
    }

    private void promoteNextWaiting(List<QueuePatient> queue) {
        boolean hasCurrent = queue.stream().anyMatch(p -> "current".equals(p.getStatus()));
        if (!hasCurrent) {
            queue.stream()
                    .filter(p -> "waiting".equals(p.getStatus()))
                    .findFirst()
                    .ifPresent(p -> p.setStatus("current"));
        }
    }
}
