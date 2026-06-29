package com.community.volunteerhub.repository;

import com.community.volunteerhub.entity.EventDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<EventDetails, Integer> {

    
    List<EventDetails> findByOrganizerId(String organizerId);
}
