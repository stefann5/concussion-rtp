package com.ftn.sbnz.service.auth;

import com.ftn.sbnz.model.auth.Role;
import com.ftn.sbnz.model.auth.User;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Component
public class UserStore {

    private final PasswordEncoder encoder;
    private final Map<String, User> users = new ConcurrentHashMap<>();

    public UserStore(PasswordEncoder encoder) {
        this.encoder = encoder;
    }

    @PostConstruct
    public void seed() {
        register(new User("admin", encoder.encode("admin"), Role.ADMIN, "System administrator", null));
        register(new User("doctor", encoder.encode("doctor"), Role.DOCTOR, "Dr. Petrović", null));
        register(new User("trainer", encoder.encode("trainer"), Role.DOCTOR, "Athletic trainer", null));
    }

    public void register(User user) {
        users.put(user.getUsername(), user);
    }

    public Optional<User> find(String username) {
        return Optional.ofNullable(users.get(username));
    }

    public boolean matches(User user, String rawPassword) {
        return encoder.matches(rawPassword, user.getPasswordHash());
    }

    public java.util.Collection<User> all() {
        return users.values();
    }
}
