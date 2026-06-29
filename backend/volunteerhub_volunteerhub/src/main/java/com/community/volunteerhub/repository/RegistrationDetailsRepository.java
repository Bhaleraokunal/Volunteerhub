package com.community.volunteerhub.repository;

import com.community.volunteerhub.entity.RegistrationDetails;
import com.community.volunteerhub.entity.RegistrationId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RegistrationDetailsRepository
        extends JpaRepository<RegistrationDetails, RegistrationId> {

    boolean existsByVolunteerIdAndEventId(String volunteerId, Integer eventId);

    List<RegistrationDetails> findByEventId(Integer eventId);
}
