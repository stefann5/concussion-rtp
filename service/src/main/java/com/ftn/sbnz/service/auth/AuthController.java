package com.ftn.sbnz.service.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserStore userStore;
    private final JwtUtil jwtUtil;

    public AuthController(UserStore userStore, JwtUtil jwtUtil) {
        this.userStore = userStore;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        return userStore.find(username)
                .filter(u -> userStore.matches(u, password))
                .<ResponseEntity<?>>map(u -> ResponseEntity.ok(Map.of(
                        "token", jwtUtil.issue(u),
                        "username", u.getUsername(),
                        "role", u.getRole().name(),
                        "displayName", u.getDisplayName(),
                        "athleteId", u.getLinkedAthleteId() == null ? "" : u.getLinkedAthleteId()
                )))
                .orElseGet(() -> ResponseEntity.status(401).body(Map.of("error", "Invalid credentials")));
    }

}
