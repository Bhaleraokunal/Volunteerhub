package com.community.volunteerhub.repository;

import com.community.volunteerhub.entity.SessionToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionTokenRepository extends JpaRepository<SessionToken, String> {

    void deleteByEmailId(String emailId);

    SessionToken findByToken(String token);
}
