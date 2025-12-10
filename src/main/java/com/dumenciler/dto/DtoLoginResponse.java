package com.dumenciler.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class DtoLoginResponse {
    private Integer id;
    private String firstName;
    private String lastName;
    private String message;
    private com.dumenciler.entities.Role role;
}
