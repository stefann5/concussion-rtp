package com.ftn.sbnz.service.auth;

import com.ftn.sbnz.model.auth.Role;
import com.ftn.sbnz.model.auth.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {
    private static final String SECRET = "sbnz-concussion-super-secret-key-please-change-in-production-32b";
    private static final long EXPIRATION_MS = 8 * 60 * 60 * 1000L;

    private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    public String issue(User user) {
        Date now = new Date();
        return Jwts.builder()
                .subject(user.getUsername())
                .claim("role", user.getRole().name())
                .claim("athleteId", user.getLinkedAthleteId())
                .claim("displayName", user.getDisplayName())
                .issuedAt(now)
                .expiration(new Date(now.getTime() + EXPIRATION_MS))
                .signWith(key)
                .compact();
    }

    public Claims parse(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }

    public Role roleOf(Claims c) { return Role.valueOf(c.get("role", String.class)); }
}
