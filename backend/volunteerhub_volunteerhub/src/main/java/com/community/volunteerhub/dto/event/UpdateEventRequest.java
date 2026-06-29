package com.community.volunteerhub.dto.event;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UpdateEventRequest {

    private String eventName;
    private String address;
    private String city;
    private String description;
    private Integer maxAllowedRegistrations;
    private LocalDate eventStartDate;
    private LocalDate eventEndDate;
    private Boolean registrationAllowed;
	public String getEventName() {
		return eventName;
	}
	public void setEventName(String eventName) {
		this.eventName = eventName;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Integer getMaxAllowedRegistrations() {
		return maxAllowedRegistrations;
	}
	public void setMaxAllowedRegistrations(Integer maxAllowedRegistrations) {
		this.maxAllowedRegistrations = maxAllowedRegistrations;
	}
	public LocalDate getEventStartDate() {
		return eventStartDate;
	}
	public void setEventStartDate(LocalDate eventStartDate) {
		this.eventStartDate = eventStartDate;
	}
	public LocalDate getEventEndDate() {
		return eventEndDate;
	}
	public void setEventEndDate(LocalDate eventEndDate) {
		this.eventEndDate = eventEndDate;
	}
	public Boolean getRegistrationAllowed() {
		return registrationAllowed;
	}
	public void setRegistrationAllowed(Boolean registrationAllowed) {
		this.registrationAllowed = registrationAllowed;
	}
	
    
}
