package com.doxly.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityItemDTO {
    private String id;
    private String type;
    private String text;
    private String time;
    private LocalDateTime timestamp;
}
