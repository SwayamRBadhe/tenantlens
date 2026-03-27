package com.tenantlens.propertyservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertyResponse {

    private String address;
    private Double safetyScore;
    private Double reviewScore;
    private Double rentScore;
    private Double overallScore;
    private String aiReport;
}