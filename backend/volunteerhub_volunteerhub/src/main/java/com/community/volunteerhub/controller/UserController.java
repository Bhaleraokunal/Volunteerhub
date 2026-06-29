package com.community.volunteerhub.controller;

import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;
import com.community.volunteerhub.dto.ResetPasswordRequest;

import com.community.volunteerhub.dto.ApiResponse;
import com.community.volunteerhub.dto.UserLoginRequest;
import com.community.volunteerhub.dto.UserRegisterRequest;
import com.community.volunteerhub.dto.UserUpdateRequest;
import com.community.volunteerhub.entity.UserDetails;
import com.community.volunteerhub.service.UserService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

// Add other needed imports here

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Helper: extract token from Authorization header
    private String extractToken(String authHeader) {
        if (authHeader == null) return null;
        if (authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    // LOGIN API
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody UserLoginRequest req) {

        String token = userService.login(req.getEmailId(), req.getPassword());

        if (token == null) {
            return ResponseEntity.status(401)
                    .body(new ApiResponse(false, "Invalid credentials"));
        }

        // You can also return user info + token if needed
        return ResponseEntity.ok(new ApiResponse(true, "Login successful", token));
    }
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(
            @Valid @RequestBody UserRegisterRequest req,
            BindingResult result) {

        if (result.hasErrors()) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, result.getFieldError().getDefaultMessage()));
        }

        try {
            userService.registerUser(req);
            return ResponseEntity.ok(new ApiResponse(true, "User registered successfully"));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, ex.getMessage()));
        }
    }



    // UPDATE API — SECURED WITH TOKEN
    @PutMapping("/update")
    public ResponseEntity<ApiResponse> update(
            @RequestBody UserUpdateRequest req,
            @RequestHeader(name = "Authorization", required = false) String auth) {

        String token = extractToken(auth);

        if (!userService.isValidToken(token)) {
            return ResponseEntity.status(401)
                    .body(new ApiResponse(false, "Unauthorized: Invalid or missing token"));
        }

        String emailFromToken = userService.getEmailFromToken(token);

        try {
            UserDetails updated = userService.updateProfile(req, emailFromToken);

            // Do not expose password in response
            updated.setPassword(null);

            return ResponseEntity.ok(
                    new ApiResponse(true, "Profile updated", updated)
            );

        } catch (SecurityException ex) {
            return ResponseEntity.status(401)
                    .body(new ApiResponse(false, ex.getMessage()));

        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, ex.getMessage()));
        }
    }
    
    @PostMapping("/resetPassword")
    public ResponseEntity<ApiResponse> resetPassword(
            @RequestHeader(name = "Authorization", required = false) String auth,
            @RequestBody ResetPasswordRequest req) {

        String token = extractToken(auth);

        if (!userService.isValidToken(token)) {
            return ResponseEntity.status(401)
                    .body(new ApiResponse(false, "Unauthorized: Invalid or missing token"));
        }

        // Email from token (authoritative)
        String email = userService.getEmailFromToken(token);

        boolean ok = userService.resetPassword(email, req.getOldPassword(), req.getNewPassword());

        if (!ok) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Invalid old password or user not found"));
        }

        return ResponseEntity.ok(
                new ApiResponse(true, "Password reset successful")
        );
    }


    // LOGOUT API
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(
            @RequestHeader(name = "Authorization", required = false) String auth) {

        String token = extractToken(auth);

        boolean ok = userService.logout(token);

        if (!ok) {
            return ResponseEntity.status(401)
                    .body(new ApiResponse(false, "Unauthorized or already logged out"));
        }

        return ResponseEntity.ok(new ApiResponse(true, "Logged out successfully"));
    }
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse> getProfile(
            @RequestHeader(name = "Authorization", required = false) String auth) {

        String token = extractToken(auth);

        if (!userService.isValidToken(token)) {
            return ResponseEntity.status(401)
                    .body(new ApiResponse(false, "Unauthorized: Invalid or missing token"));
        }

        // Get logged-in user's email from token
        String email = userService.getEmailFromToken(token);

        UserDetails user = userService.getProfile(email);

        if (user == null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "User not found"));
        }

        user.setPassword(null); // Hide password in response

        return ResponseEntity.ok(
                new ApiResponse(true, "Profile fetched successfully", user)
        );
    }

}
