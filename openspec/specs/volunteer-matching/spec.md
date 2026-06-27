# Volunteer Matching Specification

## Purpose

Automates the geographic and capacity-based matching of approved hardware donations to volunteer technicians who will perform the necessary refurbishments.

## Requirements

### Requirement: Geographic Matching

The system MUST match a hardware donation to available technicians within a maximum configured geographic radius using PostGIS location data.

#### Scenario: Technician Available Within Radius

- GIVEN an approved hardware donation at a specific location
- WHEN the system searches for available technicians
- THEN the system MUST return technicians located within the maximum allowed radius

#### Scenario: No Technicians Available Within Radius

- GIVEN an approved hardware donation at a specific location
- WHEN the system searches for available technicians and none are within the radius
- THEN the system MUST flag the donation as "Pending Match"
- AND the system MUST NOT assign it to a distant technician

### Requirement: Capacity-Based Matching

The system MUST consider the current workload and maximum capacity of a technician before assigning them new hardware to refurbish.

#### Scenario: Technician Has Available Capacity

- GIVEN a technician within the radius who is below their maximum refurbishment capacity
- WHEN a new hardware donation needs matching
- THEN the system MAY assign the hardware to this technician

#### Scenario: Technician is at Maximum Capacity

- GIVEN a technician within the radius who has reached their maximum refurbishment capacity
- WHEN a new hardware donation needs matching
- THEN the system MUST NOT assign the hardware to this technician
