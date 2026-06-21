package com.doxly.backend.repository;

import com.doxly.backend.model.PatientRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PatientRecordRepository extends JpaRepository<PatientRecord, String> {
    Optional<PatientRecord> findByPhone(String phone);
}
