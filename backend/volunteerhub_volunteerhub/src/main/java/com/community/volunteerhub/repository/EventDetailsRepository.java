package com.community.volunteerhub.repository;

import com.community.volunteerhub.entity.EventDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventDetailsRepository
        extends JpaRepository<EventDetails, Integer> {

    List<EventDetails> findByOrganizerId(String organizerId);

    List<EventDetails> findByRegistrationAllowedTrue();
}
