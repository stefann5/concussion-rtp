package com.ftn.sbnz.service.auth;

import com.ftn.sbnz.model.auth.Role;
import com.ftn.sbnz.model.auth.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserStore userStore;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder encoder;

    public AuthController(UserStore userStore, JwtUtil jwtUtil, PasswordEncoder encoder) {
        this.userStore = userStore;
        this.jwtUtil = jwtUtil;
        this.encoder = encoder;
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

    @PostMapping("/register-athlete-account")
    public ResponseEntity<?> registerAthleteAccount(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        String athleteId = body.get("athleteId");
        String displayName = body.getOrDefault("displayName", username);
        if (userStore.find(username).isPresent()) {
            return ResponseEntity.status(409).body(Map.of("error", "Username already exists"));
        }
        userStore.register(new User(username, encoder.encode(password), Role.ATHLETE, displayName, athleteId));
        return ResponseEntity.ok(Map.of("ok", true));
    }
}
