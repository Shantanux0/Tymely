package com.doxly.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientRecord {
    @Id
    private String id;

    private String name;
    private String phone;
    private Integer age;
    private String gender; // "M" | "F"
    private String lastVisit;
    private Integer totalVisits;
    private Double totalPaid;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "patient_tags", joinColumns = @JoinColumn(name = "patient_id"))
    @Column(name = "tag")
    private List<String> tags;
}
