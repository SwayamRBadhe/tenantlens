package com.tenantlens.propertyservice.service;

import com.tenantlens.propertyservice.dto.PropertyRequest;
import com.tenantlens.propertyservice.dto.PropertyResponse;
import com.tenantlens.propertyservice.model.Property;
import com.tenantlens.propertyservice.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private RestTemplate restTemplate;

    // Intelligence service URL from application.properties
    @Value("${intelligence.service.url}")
    private String intelligenceServiceUrl;

    // Analyze a property
    public PropertyResponse analyzeProperty(PropertyRequest request) {

        // Call Python Intelligence Service
        String url = intelligenceServiceUrl + "/analyze";
        PropertyResponse intelligenceResponse = restTemplate.postForObject(
                url, request, PropertyResponse.class);

        // Save search to database
        Property property = new Property();
        property.setAddress(request.getAddress());
        property.setUserEmail(request.getUserEmail());
        property.setSearchedAt(LocalDateTime.now());

        if (intelligenceResponse != null) {
            property.setSafetyScore(intelligenceResponse.getSafetyScore());
            property.setReviewScore(intelligenceResponse.getReviewScore());
            property.setRentScore(intelligenceResponse.getRentScore());
            property.setOverallScore(intelligenceResponse.getOverallScore());
            property.setAiReport(intelligenceResponse.getAiReport());
        }

        propertyRepository.save(property);

        return intelligenceResponse;
    }

    // Get search history for a user
    public List<Property> getHistory(String userEmail) {
        return propertyRepository.findByUserEmailOrderBySearchedAtDesc(userEmail);
    }
}