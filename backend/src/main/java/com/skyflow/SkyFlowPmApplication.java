package com.skyflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SkyFlowPmApplication {
    public static void main(String[] args) {
        SpringApplication.run(SkyFlowPmApplication.class, args);
    }
}
