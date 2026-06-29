package com.community.volunteerhub.service;

import com.community.volunteerhub.entity.UserDetails;
import com.community.volunteerhub.repository.UserDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserService {

    @Autowired
    private UserDetailsRepository repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // simple in-memory session/token store: token -> email
    private final Map<String, String> tokenStore = new ConcurrentHashMap<>();

    // Register (update your existing registration code to use this)
    public void registerUser(UserDetails user) {
        String email = user.getEmailId().toLowerCase().trim();
        if (repo.existsById(email)) {
            throw new IllegalArgumentException("Email already registered");
        }
        // hash password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEmailId(email);
        repo.save(user);
    }

    // Login: returns a session token on success
    public String login(String email, String rawPassword) {
        Optional<UserDetails> opt = repo.findById(email);
        if (opt.isEmpty()) return null;
        UserDetails user = opt.get();
        if (passwordEncoder.matches(rawPassword, user.getPassword())) {
            String token = UUID.randomUUID().toString();
            tokenStore.put(token, email);
            return token;
        }
        return null;
    }

    public boolean validateToken(String token) {
        return token != null && tokenStore.containsKey(token);
    }

    public String getEmailFromToken(String token) {
        return tokenStore.get(token);
    }

    public void logout(String token) {
        if (token != null) tokenStore.remove(token);
    }

    public UserDetails getProfile(String email) {
        return repo.findById(email).orElse(null);
    }

    public UserDetails updateProfile(UserDetails updated) {
        String email = updated.getEmailId();
        Optional<UserDetails> opt = repo.findById(email);
        if (opt.isEmpty()) throw new IllegalArgumentException("User not found");
        UserDetails existing = opt.get();
        if (updated.getPhoneNumber() != null) existing.setPhoneNumber(updated.getPhoneNumber());
        if (updated.getAddress() != null) existing.setAddress(updated.getAddress());
        if (updated.getUserRole() != null) existing.setUserRole(updated.getUserRole());
        return repo.save(existing);
    }

    public boolean resetPassword(String email, String oldPassword, String newPassword) {
        Optional<UserDetails> opt = repo.findById(email);
        if (opt.isEmpty()) return false;
        UserDetails existing = opt.get();
        if (!passwordEncoder.matches(oldPassword, existing.getPassword())) return false;
        existing.setPassword(passwordEncoder.encode(newPassword));
        repo.save(existing);
        return true;
    }
}
