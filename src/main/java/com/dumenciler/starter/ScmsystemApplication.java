package com.dumenciler.starter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EntityScan(basePackages ="com.dumenciler" )
@ComponentScan(basePackages = "com.dumenciler")
@EnableJpaRepositories(basePackages = "com.dumenciler")
@SpringBootApplication
public class ScmsystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(ScmsystemApplication.class, args);
	}

}
