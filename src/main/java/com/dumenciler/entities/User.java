package com.dumenciler.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;

import lombok.NoArgsConstructor;


@Entity
@Table(name = "user",schema = "public")
@Data//getter setter
@NoArgsConstructor
@AllArgsConstructor

public class User {

	@Id//primary key
	@Column(name = "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)//sequans oluşturup bir bir artmasını sağlar
	private Integer id;
	
	@Column(name = "first_name" , nullable = false)
	private String firstName;
	
	@Column(name = "last_name",nullable = false)
	private String lastName;
	
	@Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;
	
}
