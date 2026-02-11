package com.pankassi.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
// We tell Hibernate to scan entities IN both projects:
@EntityScan(basePackages = {
		"com.pankassi.backend.domain.model", // Our entities (Patient)
		"com.pankassi.accesscore.domain.model" // The entities in the library (Client)
})
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
