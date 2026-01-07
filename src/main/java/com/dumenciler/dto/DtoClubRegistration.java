package com.dumenciler.dto;

import com.dumenciler.entities.RegistrationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DtoClubRegistration {
    private Integer id;
    private Integer userId;
    private String userName; // Frontend'de göstermek kolay olsun diye
    private Integer clubId;
    private String clubName;
    private RegistrationStatus status;
    private LocalDateTime applicationDate;
}