package com.doxly.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityItem {
    @Id
    private String id;

    private String type; // "done" | "added" | "skipped" | "rescheduled" | "payment"
    private String text;
    private String time; // e.g. "Just now", "5m ago"

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
