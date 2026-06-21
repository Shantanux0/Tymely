package com.doxly.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QueuePatientDTO {
    private String id;
    private Integer token;
    private String name;
    private String phone;
    private Integer age;
    private String gender;
    private String reason;
    private String arrivedAt;
    private Integer waitMins;
    private String status;
    private Double amount;
    private String trackingCode;
}
