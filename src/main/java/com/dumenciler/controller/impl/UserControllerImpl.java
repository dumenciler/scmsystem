package com.dumenciler.controller.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dumenciler.controller.IUserController;
import com.dumenciler.dto.DtoLoginRequest;
import com.dumenciler.dto.DtoLoginResponse;
import com.dumenciler.dto.DtoRegisterRequest;
import com.dumenciler.dto.DtoUser;
import com.dumenciler.dto.DtoUserIU;
import com.dumenciler.services.IUserService;

@CrossOrigin(origins = "http://localhost:3000")

@RestController
@RequestMapping("/rest/api/user")
public class UserControllerImpl implements IUserController {

	@Autowired
	private IUserService userService;

	@PostMapping(path = "/save")
	@Override
	public DtoUser saveUser(@RequestBody DtoUserIU dtoUserIU) {

		return userService.saveUser(dtoUserIU);
	}

	@GetMapping(path = "/list")
	@Override
	public List<DtoUser> getAllUser() {

		return userService.getAllUser();
	}

	@GetMapping(path = "/list/{id}")
	@Override
	public DtoUser getUserById(@PathVariable(name = "id") Integer id) {

		return userService.getUserById(id);
	}

	@DeleteMapping(path = "/delete/{id}")
	@Override
	public void deleteUser(@PathVariable(name = "id") Integer id) {

		userService.deleteUser(id);
	}

	@PutMapping(path = "/update/{id}")
	@Override
	public DtoUser updateUser(@PathVariable(name = "id") Integer id, @RequestBody DtoUserIU dtoUserIU) {

		return userService.updateUser(id, dtoUserIU);
	}

	@PostMapping(path = "/login")
	public DtoLoginResponse login(@RequestBody DtoLoginRequest dtoLoginRequest) {
		return userService.login(dtoLoginRequest);
	}

	@PostMapping(path = "/register")
	public DtoLoginResponse register(@RequestBody DtoRegisterRequest dtoRegisterRequest) {
		return userService.register(dtoRegisterRequest);
	}

	@PostMapping(path = "/forgot-password")
	public DtoLoginResponse forgotPassword(@RequestBody com.dumenciler.dto.DtoForgotPasswordRequest request) {
		String token = userService.forgotPassword(request.getEmail());
		DtoLoginResponse response = new DtoLoginResponse();
		response.setMessage("Reset token sent to console. Token: " + token); // Returning token here for easy testing
		return response;
	}

	@PostMapping(path = "/reset-password")
	public DtoLoginResponse resetPassword(@RequestBody com.dumenciler.dto.DtoResetPasswordRequest request) {
		boolean result = userService.resetPassword(request.getToken(), request.getNewPassword());
		DtoLoginResponse response = new DtoLoginResponse();
		if (result) {
			response.setMessage("Password reset successful!");
		} else {
			response.setMessage("Invalid or expired token!");
		}
		return response;
	}

}
