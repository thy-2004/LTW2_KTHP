package com.example.controller;

import com.example.model.User;
import com.example.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Trả về username + role để frontend kiểm tra redirect
    @GetMapping("/current-user")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User u = userRepository.findByUsername(userDetails.getUsername());
        if (u == null) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.ok(new UserResponse(u.getUsername(), u.getRole()));
    }

    static class UserResponse {
        private String username;
        private String role;
        public UserResponse(String username, String role) {
            this.username = username;
            this.role = role;
        }
        public String getUsername() { return username; }
        public String getRole() { return role; }
    }
}
