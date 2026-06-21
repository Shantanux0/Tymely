package com.doxly.backend.repository;

import com.doxly.backend.model.QueuePatient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface QueuePatientRepository extends JpaRepository<QueuePatient, String> {
    Optional<QueuePatient> findByTrackingCode(String trackingCode);
    List<QueuePatient> findByStatusIn(List<String> statuses);
}
