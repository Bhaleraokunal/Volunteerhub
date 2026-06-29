package com.community.volunteerhub.service.registration;

import com.community.volunteerhub.entity.EventDetails;
import com.community.volunteerhub.entity.RegistrationDetails;
import com.community.volunteerhub.entity.RegistrationId;
import com.community.volunteerhub.repository.EventDetailsRepository;
import com.community.volunteerhub.repository.RegistrationDetailsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RegistrationService {

    private final RegistrationDetailsRepository registrationRepo;
    private final EventDetailsRepository eventRepo;

    public RegistrationService(RegistrationDetailsRepository registrationRepo,
                               EventDetailsRepository eventRepo) {
        this.registrationRepo = registrationRepo;
        this.eventRepo = eventRepo;
    }

    @Transactional
    public void registerForEvent(String volunteerEmail, Integer eventId) {

        EventDetails event = eventRepo.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        if (!event.getRegistrationAllowed()) {
            throw new IllegalStateException("Registration closed");
        }

        if (registrationRepo.existsByVolunteerIdAndEventId(volunteerEmail, eventId)) {
            throw new IllegalStateException("Already registered");
        }

        long count = registrationRepo.findByEventId(eventId).size();
        if (count >= event.getMaxAllowedRegistrations()) {
            throw new IllegalStateException("Registration limit reached");
        }

        RegistrationDetails reg = new RegistrationDetails();
        reg.setVolunteerId(volunteerEmail);
        reg.setEventId(eventId);
        reg.setStatus("REGISTERED");

        registrationRepo.save(reg);
    }
}
