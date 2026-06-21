package com.doxly.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientRecordDTO {
    private String id;
    private String name;
    private String phone;
    private Integer age;
    private String gender;
    private String lastVisit;
    private Integer totalVisits;
    private Double totalPaid;
    private List<String> tags;
}
