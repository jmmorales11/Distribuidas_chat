package Chat.controller;

import Chat.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/api/active-users")
    public Set<String> getActiveUsers() {
        return userService.getActiveUsers();
    }
}

