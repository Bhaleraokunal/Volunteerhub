package com.community.volunteerhub.dto;

public class UserLoginRequest {
    private String emailId;
    private String password;
    // getters/setters
    public String getEmailId() { return emailId; }
    public void setEmailId(String emailId) { this.emailId = emailId; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
