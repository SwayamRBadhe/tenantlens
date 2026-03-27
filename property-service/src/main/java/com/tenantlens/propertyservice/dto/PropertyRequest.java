package com.tenantlens.propertyservice.dto;

import lombok.Data;

@Data
public class PropertyRequest {
    private String address;
    private String userEmail;
}