package com.doxly.backend.controller;

import com.doxly.backend.dto.PatientRecordDTO;
import com.doxly.backend.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @GetMapping
    public ResponseEntity<List<PatientRecordDTO>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }
}
