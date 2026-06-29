package com.community.volunteerhub.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_details")
public class UserDetails {

    @Id
    private String emailId;   // Primary Key

    private Long phoneNumber;
    private String address;
    private String password;
    private String userRole;

    // getters and setters
    public String getEmailId() { return emailId; }
    public void setEmailId(String emailId) { this.emailId = emailId; }

    public Long getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(long phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }
}
