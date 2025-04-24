package com.example.controller;

import com.example.model.CoffeeTable;
import com.example.model.User;
import com.example.repository.TableRepository;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TableRepository tableRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    // Lấy thông tin user hiện tại từ session
    @GetMapping("/current-user")
    public ResponseEntity<?> getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            User user = userRepository.findByUsername(username);
            if (user == null) {
                return ResponseEntity.status(404).body("User not found");
            }
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).body("Not authenticated");
    }

    // CRUD Users
    @PostMapping("/users")
    @Transactional
    public ResponseEntity<?> createUser(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/users/{id}")
    @Transactional
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User user) {
        User existing = userRepository.findById(id).orElse(null);
        if (existing == null) return ResponseEntity.status(404).body("User not found");
        existing.setUsername(user.getUsername());
        existing.setRole(user.getRole());
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            existing.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return ResponseEntity.ok(userRepository.save(existing));
    }

    @DeleteMapping("/users/{id}")
    @Transactional
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted");
    }

    // CRUD Tables
    @PostMapping("/tables")
    @Transactional
    public ResponseEntity<?> createTable(@RequestBody CoffeeTable table) {
        return ResponseEntity.ok(tableRepository.save(table));
    }

    @GetMapping("/tables")
    public ResponseEntity<?> getAllTables() {
        return ResponseEntity.ok(tableRepository.findAll());
    }

    @PutMapping("/tables/{id}")
    @Transactional
    public ResponseEntity<?> updateTable(@PathVariable Long id, @RequestBody CoffeeTable table) {
        CoffeeTable existing = tableRepository.findById(id).orElse(null);
        if (existing == null) return ResponseEntity.status(404).body("Table not found");
        existing.setTableNumber(table.getTableNumber());
        existing.setContent(table.getContent());
        existing.setStatus(table.getStatus());
        return ResponseEntity.ok(tableRepository.save(existing));
    }

    @DeleteMapping("/tables/{id}")
    @Transactional
    public ResponseEntity<?> deleteTable(@PathVariable Long id) {
        tableRepository.deleteById(id);
        return ResponseEntity.ok("Table deleted");
    }
}