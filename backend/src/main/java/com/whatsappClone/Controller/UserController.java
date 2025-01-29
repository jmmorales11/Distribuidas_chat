package com.whatsappClone.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.whatsappClone.Exception.UserException;
import com.whatsappClone.Model.User;
import com.whatsappClone.Payload.ApiResponse;
import com.whatsappClone.Payload.UpdateUserRequest;
import com.whatsappClone.ServiceImpl.UserServiceImpl;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserServiceImpl userService;

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfileHandler(@RequestHeader("Authorization") String token)
            throws UserException {

        User user = this.userService.findUserProfile(token);
        return new ResponseEntity<User>(user, HttpStatus.OK);
    }

    @GetMapping("/{query}")
    public ResponseEntity<List<User>> searchUserHandler(@PathVariable("query") String query) {

        List<User> users = this.userService.searchUser(query);
        return new ResponseEntity<List<User>>(users, HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse> updateUserHandler(@RequestBody UpdateUserRequest request,
            @RequestHeader("Authorization") String token) throws UserException {

        User user = this.userService.findUserProfile(token);
        this.userService.updateUser(user.getId(), request);

        ApiResponse response = new ApiResponse();
        response.setMessage("User updated Successfully");
        response.setStatus(true);

        return new ResponseEntity<ApiResponse>(response, HttpStatus.ACCEPTED);
    }
    //Cambiar el estado a desconectado
    @PutMapping("/status-activate/{userId}")
    public ResponseEntity<ApiResponse> activateUserStatusHandler(@PathVariable("userId") Integer userId) throws UserException {

        // Buscar el usuario y activar el estado
        User user = this.userService.findUserById(userId);
        user.setStatus(true); // Establecer el estado como true
        this.userService.updateUser(user.getId(), new UpdateUserRequest()); // Actualiza el usuario
        System.out.println("Connected User: " + user.getName());
        ApiResponse response = new ApiResponse();
        response.setMessage("User status activated successfully. New status: " + user.getStatus());
        response.setStatus(true);

        return new ResponseEntity<ApiResponse>(response, HttpStatus.OK);
    }

    @PutMapping("/status-deactivate/{userId}")
    public ResponseEntity<ApiResponse> deactivateUserStatusHandler(@PathVariable("userId") Integer userId) throws UserException {

        // Buscar el usuario y desactivar el estado
        User user = this.userService.findUserById(userId);
        user.setStatus(false); // Establecer el estado como false
        this.userService.updateUser(user.getId(), new UpdateUserRequest()); // Actualiza el usuario
        System.out.println("User logged out: " + user.getName());
        ApiResponse response = new ApiResponse();
        response.setMessage("User status deactivated successfully. New status: " + user.getStatus());
        response.setStatus(true);

        return new ResponseEntity<ApiResponse>(response, HttpStatus.OK);
    }



}
