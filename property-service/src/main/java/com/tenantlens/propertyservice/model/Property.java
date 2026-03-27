package com.tenantlens.propertyservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "properties")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Address entered by user
    @Column(nullable = false)
    private String address;

    // User who searched this property
    @Column(nullable = false)
    private String userEmail;

    // Safety score from intelligence service
    private Double safetyScore;

    // Fake review score from intelligence service
    private Double reviewScore;

    // Rent manipulation score from intelligence service
    private Double rentScore;

    // Overall trust score
    private Double overallScore;

    // Full AI report from intelligence service
    @Column(columnDefinition = "TEXT")
    private String aiReport;

    // When this search was done
    private LocalDateTime searchedAt;
}