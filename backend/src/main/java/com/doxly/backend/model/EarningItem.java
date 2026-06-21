package com.doxly.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "earnings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EarningItem {
    @Id
    private String day; // "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"

    private Double value;
}
