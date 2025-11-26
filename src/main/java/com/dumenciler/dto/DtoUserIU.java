package com.dumenciler.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DtoUserIU {

	private String firstName;
	private String lastName;
	private String username;
	private String password;
	private String currentPassword;

}
