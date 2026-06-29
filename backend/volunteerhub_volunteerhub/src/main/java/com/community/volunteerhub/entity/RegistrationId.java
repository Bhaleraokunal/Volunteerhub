package com.community.volunteerhub.entity;

import java.io.Serializable;
import java.util.Objects;

public class RegistrationId implements Serializable {

    private String volunteerId;
    private Integer eventId;

    public RegistrationId() {}

    public RegistrationId(String volunteerId, Integer eventId) {
        this.volunteerId = volunteerId;
        this.eventId = eventId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RegistrationId)) return false;
        RegistrationId that = (RegistrationId) o;
        return Objects.equals(volunteerId, that.volunteerId)
                && Objects.equals(eventId, that.eventId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(volunteerId, eventId);
    }
}
