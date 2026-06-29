package com.community.volunteerhub.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_details")
public class EventDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer eventId;

    @Column(nullable = false)
    private String eventName;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String organizerId;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(nullable = false)
    private Integer maxAllowedRegistrations;

    @Column(nullable = false)
    private LocalDate eventStartDate;

    @Column(nullable = false)
    private LocalDate eventEndDate;

    private Float rating;

    @Column(nullable = false)
    private Boolean registrationAllowed;

    private LocalDateTime createdAt;
    
    private LocalDateTime modifiedAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        modifiedAt = LocalDateTime.now();
    }

    @PreUpdate
    void onUpdate() {
        modifiedAt = LocalDateTime.now();
    }

	public Integer getEventId() {
		return eventId;
	}

	public void setEventId(Integer eventId) {
		this.eventId = eventId;
	}

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

	public String getOrganizerId() {
		return organizerId;
	}

	public void setOrganizerId(String organizerId) {
		this.organizerId = organizerId;
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

	public Float getRating() {
		return rating;
	}

	public void setRating(Float rating) {
		this.rating = rating;
	}

	public Boolean getRegistrationAllowed() {
		return registrationAllowed;
	}

	public void setRegistrationAllowed(Boolean registrationAllowed) {
		this.registrationAllowed = registrationAllowed;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getModifiedAt() {
		return modifiedAt;
	}

	public void setModifiedAt(LocalDateTime modifiedAt) {
		this.modifiedAt = modifiedAt;
	}

	

    
}
