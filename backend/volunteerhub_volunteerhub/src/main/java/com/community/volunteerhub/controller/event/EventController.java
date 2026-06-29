package com.community.volunteerhub.controller.event;

import com.community.volunteerhub.dto.ApiResponse;
import com.community.volunteerhub.dto.event.CreateEventRequest;
import com.community.volunteerhub.dto.event.EventResponse;
import com.community.volunteerhub.dto.event.UpdateEventRequest;
import com.community.volunteerhub.entity.EventDetails;
import com.community.volunteerhub.service.UserService;
import com.community.volunteerhub.service.event.EventService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/events")
public class EventController {

    private final EventService eventService;
    private final UserService userService;

    public EventController(EventService eventService, UserService userService) {
        this.eventService = eventService;
        this.userService = userService;
    }

    private String extractToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createEvent(
            @Valid @RequestBody CreateEventRequest request,
            @RequestHeader(name = "Authorization", required = false) String authHeader) {

        String token = extractToken(authHeader);

        if (!userService.isValidToken(token)) {
            return ResponseEntity.status(401)
                    .body(new ApiResponse(false, "Unauthorized"));
        }

        String organizerEmail = userService.getEmailFromToken(token);

        try {
            EventDetails event = eventService.createEvent(request, organizerEmail);
            return ResponseEntity.ok(
                    new ApiResponse(true, "Event created", mapToResponse(event))
            );
        } catch (SecurityException ex) {
            return ResponseEntity.status(403)
                    .body(new ApiResponse(false, ex.getMessage()));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, ex.getMessage()));
        }
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<ApiResponse> updateEvent(
            @PathVariable Integer eventId,
            @RequestBody UpdateEventRequest request,
            @RequestHeader(name = "Authorization", required = false) String authHeader) {

        String token = extractToken(authHeader);

        if (!userService.isValidToken(token)) {
            return ResponseEntity.status(401)
                    .body(new ApiResponse(false, "Unauthorized"));
        }

        String organizerEmail = userService.getEmailFromToken(token);
        EventDetails event = eventService.updateEvent(eventId, request, organizerEmail);

        return ResponseEntity.ok(
                new ApiResponse(true, "Event updated", mapToResponse(event))
        );
    }

    @GetMapping("/organizer")
    public ResponseEntity<ApiResponse> getOrganizerEvents(
            @RequestHeader(name = "Authorization", required = false) String authHeader) {

        String token = extractToken(authHeader);

        if (!userService.isValidToken(token)) {
            return ResponseEntity.status(401)
                    .body(new ApiResponse(false, "Unauthorized"));
        }

        String organizerEmail = userService.getEmailFromToken(token);

        List<EventResponse> events = eventService.getEventsByOrganizer(organizerEmail)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                new ApiResponse(true, "Events fetched", events)
        );
    }

    @GetMapping("/open")
    public ResponseEntity<ApiResponse> getOpenEvents() {
        List<EventResponse> events = eventService.getOpenEvents()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                new ApiResponse(true, "Open events", events)
        );
    }

    private EventResponse mapToResponse(EventDetails event) {
        EventResponse res = new EventResponse();
        res.setEventId(event.getEventId());
        res.setEventName(event.getEventName());
        res.setAddress(event.getAddress());
        res.setCity(event.getCity());
        res.setOrganizerId(event.getOrganizerId());
        res.setDescription(event.getDescription());
        res.setMaxAllowedRegistrations(event.getMaxAllowedRegistrations());
        res.setEventStartDate(event.getEventStartDate());
        res.setEventEndDate(event.getEventEndDate());
        res.setRating(event.getRating());
        res.setRegistrationAllowed(event.getRegistrationAllowed());
        return res;
    }

}
