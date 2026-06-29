package com.community.volunteerhub.controller;

import com.community.volunteerhub.dto.*;
import com.community.volunteerhub.entity.UserDetails;
import com.community.volunteerhub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    // Update your existing /register to call userService.registerUser(...)
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody UserDetails user) {
        try {
            userService.registerUser(user);
            return ResponseEntity.ok(new ApiResponse(true, "User registered successfully"));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(new ApiResponse(false, "Server error"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody UserLoginRequest req) {
        String token = userService.login(req.getEmailId(), req.getPassword());
        if (token == null) {
            return ResponseEntity.status(401).body(new ApiResponse(false, "Invalid credentials"));
        }
        return ResponseEntity.ok(new ApiResponse(true, "Login successful", token));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(@RequestHeader(name="Authorization", required=false) String auth) {
        // Expect header: Authorization: Bearer <token>
        String token = extractToken(auth);
        userService.logout(token);
        return ResponseEntity.ok(new ApiResponse(true, "Logged out"));
    }

    @GetMapping("/profile/{email}")
    public ResponseEntity<?> getProfile(@PathVariable("email") String email,
                                        @RequestHeader(name="Authorization", required=false) String auth) {
        // optional: validate token if you want to restrict profile access
        UserDetails user = userService.getProfile(email);
        if (user == null) return ResponseEntity.status(404).body(new ApiResponse(false, "User not found"));
        user.setPassword(null); // don't send password hash
        return ResponseEntity.ok(user);
    }

    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody UserUpdateRequest req,
                                    @RequestHeader(name="Authorization", required=false) String auth) {
        try {
            // Optionally validate token/email match here
            UserDetails update = new UserDetails();
            update.setEmailId(req.getEmailId());
            update.setPhoneNumber(req.getPhoneNumber());
            update.setAddress(req.getAddress());
            update.setUserRole(req.getUserRole());
            UserDetails saved = userService.updateProfile(update);
            saved.setPassword(null);
            return ResponseEntity.ok(new ApiResponse(true, "Profile updated", saved));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(404).body(new ApiResponse(false, ex.getMessage()));
        }
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<ApiResponse> resetPassword(@RequestBody ResetPasswordRequest req) {
        boolean ok = userService.resetPassword(req.getEmailId(), req.getOldPassword(), req.getNewPassword());
        if (!ok) return ResponseEntity.status(400).body(new ApiResponse(false, "Password reset failed"));
        return ResponseEntity.ok(new ApiResponse(true, "Password reset successful"));
    }

    // helper
    private String extractToken(String authHeader) {
        if (authHeader == null) return null;
        if (authHeader.startsWith("Bearer ")) return authHeader.substring(7);
        return authHeader;
    }
}
