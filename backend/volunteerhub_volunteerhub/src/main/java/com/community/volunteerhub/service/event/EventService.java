package com.community.volunteerhub.service.event;

import com.community.volunteerhub.dto.event.CreateEventRequest;
import com.community.volunteerhub.dto.event.UpdateEventRequest;
import com.community.volunteerhub.entity.EventDetails;
import com.community.volunteerhub.entity.UserDetails;
import com.community.volunteerhub.repository.EventDetailsRepository;
import com.community.volunteerhub.repository.UserDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EventService {

    private final EventDetailsRepository repo;

    public EventService(EventDetailsRepository repo) {
        this.repo = repo;
    }
    @Autowired
    private UserDetailsRepository userRepo;

    @Transactional
    public EventDetails createEvent(CreateEventRequest req, String organizerEmail) {

        UserDetails user = userRepo.findById(organizerEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!"ORGANIZER".equalsIgnoreCase(user.getUserRole())) {
            throw new SecurityException("Only organizers can create events");
        }

        EventDetails event = new EventDetails();
        event.setEventName(req.getEventName());
        event.setAddress(req.getAddress());
        event.setCity(req.getCity());
        event.setDescription(req.getDescription());
        event.setMaxAllowedRegistrations(req.getMaxAllowedRegistrations());
        event.setEventStartDate(req.getEventStartDate());
        event.setEventEndDate(req.getEventEndDate());
        event.setRegistrationAllowed(req.getRegistrationAllowed());
        event.setOrganizerId(organizerEmail);

        return repo.save(event);
    }

    
    @Transactional
    public EventDetails updateEvent(
            Integer eventId,
            UpdateEventRequest req,
            String organizerEmail) {

        EventDetails event = repo.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        // Organizer check
        if (!event.getOrganizerId().equals(organizerEmail)) {
            throw new SecurityException("Only organizer can update this event");
        }

        if (req.getEventName() != null)
            event.setEventName(req.getEventName());

        if (req.getAddress() != null)
            event.setAddress(req.getAddress());

        if (req.getCity() != null)
            event.setCity(req.getCity());

        if (req.getDescription() != null)
            event.setDescription(req.getDescription());

        if (req.getMaxAllowedRegistrations() != null)
            event.setMaxAllowedRegistrations(req.getMaxAllowedRegistrations());

        if (req.getEventStartDate() != null)
            event.setEventStartDate(req.getEventStartDate());

        if (req.getEventEndDate() != null)
            event.setEventEndDate(req.getEventEndDate());

        if (req.getRegistrationAllowed() != null)
            event.setRegistrationAllowed(req.getRegistrationAllowed());

        return repo.save(event);
    }


    public List<EventDetails> getEventsByOrganizer(String organizerEmail) {
        return repo.findByOrganizerId(organizerEmail);
    }

    public List<EventDetails> getOpenEvents() {
        return repo.findByRegistrationAllowedTrue();
    }


}
