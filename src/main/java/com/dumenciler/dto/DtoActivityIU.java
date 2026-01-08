package com.dumenciler.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoActivityIU {

    private String title;
    private String description;
    private LocalDateTime activityDate;
    private Integer clubId;
    // isActive will default to true on creation usually
}
