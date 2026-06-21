package com.doxly.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "queue_patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QueuePatient {
    @Id
    private String id;

    private Integer token;
    private String name;
    private String phone;
    private Integer age;
    private String gender; // "M" | "F"
    private String reason;
    private String arrivedAt;
    private Integer waitMins;
    private String status; // "waiting" | "current" | "done" | "skipped" | "rescheduled"
    private Double amount;
    private String trackingCode;
}
