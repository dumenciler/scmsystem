package com.dumenciler.dto;

import java.time.LocalDateTime;

import com.dumenciler.entities.RegistrationStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoActivityApplication {

    private Integer id;
    private DtoUser user;
    private DtoActivity activity;
    private RegistrationStatus status;
    private LocalDateTime applicationDate;
}
