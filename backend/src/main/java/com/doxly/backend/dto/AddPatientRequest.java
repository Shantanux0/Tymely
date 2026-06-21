package com.doxly.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddPatientRequest {
    private String name;
    private String phone;
    private Integer age;
    private String gender;
    private String reason;
    private Double fees;
}
