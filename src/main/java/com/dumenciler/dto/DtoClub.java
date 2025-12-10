package com.dumenciler.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DtoClub {
    private Integer id;
    private String name;
    private String description;
    private String logoLink;
}
