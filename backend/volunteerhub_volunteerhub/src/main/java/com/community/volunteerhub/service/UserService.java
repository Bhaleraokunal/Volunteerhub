package com.community.volunteerhub.service;

import com.community.volunteerhub.dto.UserRegisterRequest;
import com.community.volunteerhub.dto.UserUpdateRequest;
import com.community.volunteerhub.entity.UserDetails;
import com.community.volunteerhub.entity.SessionToken;
import com.community.volunteerhub.repository.UserDetailsRepository;
import com.community.volunteerhub.repository.SessionTokenRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserDetailsRepository repo;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private SessionTokenRepository tokenRepo;

    @Autowired
    public UserService(UserDetailsRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    // Normalize email consistently
    private String normalizeEmail(String email) {
        return (email == null) ? null : email.toLowerCase().trim();
    }

    // REGISTER
    @Transactional
    public void registerUser(UserRegisterRequest req) {

        String email = normalizeEmail(req.getEmailId());
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email must not be empty");
        }

        if (repo.existsById(email)) {
            throw new IllegalArgumentException("Email already registered");
        }

        UserDetails user = new UserDetails();
        user.setEmailId(email);
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setAddress(req.getAddress());
        user.setPhoneNumber(Long.valueOf(req.getPhoneNumber()));
        user.setUserRole(req.getUserRole());

        repo.save(user);
    }

    // LOGIN
    @Transactional
    public String login(String email, String rawPassword) {
        email = normalizeEmail(email);
        if (email == null || email.isBlank()) {
            return null;
        }

        Optional<UserDetails> opt = repo.findById(email);
        if (opt.isEmpty()) return null;

        UserDetails user = opt.get();
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) return null;

        // Remove previous token (single session allowed)
        tokenRepo.deleteByEmailId(email);

        // Generate and save new token
        String token = UUID.randomUUID().toString();

        SessionToken session = new SessionToken();
        session.setToken(token);
        session.setEmailId(email);
        session.setCreatedTime(new Timestamp(System.currentTimeMillis()));

        tokenRepo.save(session);

        return token;
    }

    public boolean isValidToken(String token) {
        return token != null && tokenRepo.findByToken(token) != null;
    }


    public String getEmailFromToken(String token) {
        SessionToken session = tokenRepo.findByToken(token);
        return session != null ? session.getEmailId() : null;
    }


    public boolean logout(String token) {
        if (token == null) return false;

        SessionToken session = tokenRepo.findByToken(token);
        if (session == null) return false;

        tokenRepo.delete(session);
        return true;
    }


    // GET PROFILE
    public UserDetails getProfile(String email) {
        String norm = normalizeEmail(email);
        if (norm == null) return null;
        return repo.findById(norm).orElse(null);
    }

    // UPDATE PROFILE
    @Transactional
    public UserDetails updateProfile(UserUpdateRequest req, String tokenEmail) {

        String normalizedTokenEmail = normalizeEmail(tokenEmail);
        if (normalizedTokenEmail == null) {
            throw new SecurityException("Unauthorized");
        }

        // Request email must match token email
        if (req.getEmailId() != null) {
            String normalizedReqEmail = normalizeEmail(req.getEmailId());
            if (!normalizedTokenEmail.equals(normalizedReqEmail)) {
                throw new SecurityException("Cannot update another user's profile");
            }
        }

        UserDetails existing = repo.findById(normalizedTokenEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (req.getPhoneNumber() != null)
            existing.setPhoneNumber(req.getPhoneNumber());

        if (req.getAddress() != null)
            existing.setAddress(req.getAddress());

        if (req.getUserRole() != null)
            existing.setUserRole(req.getUserRole());

        return repo.save(existing);
    }

    // RESET PASSWORD
    @Transactional
    public boolean resetPassword(String email, String oldPassword, String newPassword) {
        String norm = normalizeEmail(email);
        if (norm == null || norm.isBlank()) return false;

        Optional<UserDetails> opt = repo.findById(norm);
        if (opt.isEmpty()) return false;

        UserDetails existing = opt.get();
        if (!passwordEncoder.matches(oldPassword, existing.getPassword()))
            return false;

        existing.setPassword(passwordEncoder.encode(newPassword));
        repo.save(existing);

        return true;
    }
}
