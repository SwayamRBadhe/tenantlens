package com.tenantlens.propertyservice.repository;

import com.tenantlens.propertyservice.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    // Get all properties searched by a specific user
    List<Property> findByUserEmailOrderBySearchedAtDesc(String userEmail);
}