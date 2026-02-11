package com.pankassi.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
// We tell Hibernate to scan entities IN both projects:
@EntityScan(basePackages = {
		"com.pankassi.backend.domain.model", // Our entities (Patient)
		"com.pankassi.accesscore.domain.model" // The entities in the library (Client)
})

@ComponentScan(basePackages = {
		"com.pankassi.backend",              // Components (PatientService, PatientController)
		"com.pankassi.accesscore"           // Library components(AuthenticationService, SecurityConfig, etc.)
})
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
