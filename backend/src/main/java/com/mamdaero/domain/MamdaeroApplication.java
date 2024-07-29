package com.mamdaero.domain;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class MamdaeroApplication {

    public static void main(String[] args) {
        SpringApplication.run(MamdaeroApplication.class, args);
    }

}
