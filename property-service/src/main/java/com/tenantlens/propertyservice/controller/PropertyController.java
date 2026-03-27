package com.tenantlens.propertyservice.controller;

import com.tenantlens.propertyservice.dto.PropertyRequest;
import com.tenantlens.propertyservice.dto.PropertyResponse;
import com.tenantlens.propertyservice.model.Property;
import com.tenantlens.propertyservice.service.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/property")
@CrossOrigin(origins = "http://localhost:3000")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    // Analyze a property address
    @PostMapping("/analyze")
    public ResponseEntity<PropertyResponse> analyze(@RequestBody PropertyRequest request) {
        PropertyResponse response = propertyService.analyzeProperty(request);
        return ResponseEntity.ok(response);
    }

    // Get search history for a user
    @GetMapping("/history/{userEmail}")
    public ResponseEntity<List<Property>> getHistory(@PathVariable String userEmail) {
        List<Property> history = propertyService.getHistory(userEmail);
        return ResponseEntity.ok(history);
    }
}