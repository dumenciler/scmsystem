package com.dumenciler.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoActivity {

    private Integer id;
    private String title;
    private String description;
    private LocalDateTime activityDate;
    private DtoClub club;
    private boolean isActive;
}
