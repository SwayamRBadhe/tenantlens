package com.tenantlens.propertyservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    // RestTemplate is used to call the Python Intelligence Service
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}