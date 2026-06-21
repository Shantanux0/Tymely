package com.doxly.backend.service;

import com.doxly.backend.dto.PatientRecordDTO;
import com.doxly.backend.model.PatientRecord;
import com.doxly.backend.repository.PatientRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientServiceImpl implements PatientService {

    @Autowired
    private PatientRecordRepository patientRecordRepository;

    @Override
    public List<PatientRecordDTO> getAllPatients() {
        return patientRecordRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private PatientRecordDTO convertToDTO(PatientRecord record) {
        return PatientRecordDTO.builder()
                .id(record.getId())
                .name(record.getName())
                .phone(record.getPhone())
                .age(record.getAge())
                .gender(record.getGender())
                .lastVisit(record.getLastVisit())
                .totalVisits(record.getTotalVisits())
                .totalPaid(record.getTotalPaid())
                .tags(record.getTags())
                .build();
    }
}
