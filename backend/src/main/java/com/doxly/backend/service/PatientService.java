package com.doxly.backend.service;

import com.doxly.backend.dto.PatientRecordDTO;
import java.util.List;

public interface PatientService {
    List<PatientRecordDTO> getAllPatients();
}
