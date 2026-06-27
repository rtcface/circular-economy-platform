# User Authentication Specification

## Purpose

Handles custom authentication and role-based access control for different users (donors, technicians, admins) within the circular economy platform.

## Requirements

### Requirement: Role-Based Authentication

The system MUST authenticate users and assign them specific roles that determine their access levels within the application.

#### Scenario: Admin Login

- GIVEN a user with an admin role
- WHEN the user successfully logs in
- THEN the system MUST grant access to admin-specific dashboards and controls

#### Scenario: Technician Login

- GIVEN a user with a technician role
- WHEN the user successfully logs in
- THEN the system MUST grant access to their assigned hardware queue
- AND the system MUST deny access to admin-specific features

### Requirement: Secure Registration

The system MUST provide a secure registration process for new donors and volunteer technicians.

#### Scenario: New Technician Registration

- GIVEN a new user wants to become a volunteer technician
- WHEN the user submits the registration form with valid details and location
- THEN the system MUST create their account with the "Technician" role
- AND the account MUST default to a "Pending Approval" state until an admin verifies them

#### Scenario: New Donor Registration

- GIVEN a new user wants to donate hardware
- WHEN the user submits the registration form with valid details
- THEN the system MUST create their account with the "Donor" role
- AND the system MUST automatically log them in to begin the intake process
