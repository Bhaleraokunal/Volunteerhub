package com.community.volunteerhub.dto.registration;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegistrationResponse {

    private Integer eventId;
    private String volunteerId;
    private String status;
    private Boolean checkIn;
    private Float rating;
}
