package com.community.volunteerhub.dto.registration;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EventRegistrationRequest {

    @NotNull(message = "Event ID is required")
    private Integer eventId;
}
