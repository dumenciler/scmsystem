package com.dumenciler.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dumenciler.dto.DtoLoginRequest;
import com.dumenciler.dto.DtoLoginResponse;
import com.dumenciler.dto.DtoRegisterRequest;
import com.dumenciler.dto.DtoUser;
import com.dumenciler.dto.DtoUserIU;
import com.dumenciler.entities.User;
import com.dumenciler.repository.UserRepository;
import com.dumenciler.services.IUserService;



@Service
public class UserServiceImpl implements IUserService{
	
	@Autowired
	private UserRepository userRepository;
	
	@Override
	public DtoUser saveUser(DtoUserIU dtoUser) {
		DtoUser response = new DtoUser();
		User user = new User();
		BeanUtils.copyProperties(dtoUser, user);
		
		User dbUser = userRepository.save(user);
		BeanUtils.copyProperties(dbUser, response);
		return response;
		
	}

	@Override
	public List<DtoUser> getAllUser() {
		
		List<DtoUser> dtoList = new ArrayList<>();
		List<User> userList = userRepository.findAll();
		
		for(User user : userList) {
			DtoUser dto = new DtoUser();
			BeanUtils.copyProperties(user, dto);
			dtoList.add(dto);
		}
		
		return dtoList;
		
	}

	@Override
	public DtoUser getUserById(Integer id) {
		DtoUser dto = new DtoUser();
		
		Optional<User> optional = userRepository.findById(id);
		if (optional.isPresent()) {
			User dbUser =  optional.get();
			
			BeanUtils.copyProperties(dbUser, dto);
		}
		
		return dto;
	}

	@Override
	public void deleteUser(Integer id) {
		
		Optional<User> optional = userRepository.findById(id);
		if(optional.isPresent()) {
			userRepository.delete(optional.get());
		}
		
	}

	@Override
	public DtoUser updateUser(Integer id, DtoUserIU dtoUserIU) {
		DtoUser dtoUser =new DtoUser();
		
		Optional<User> optional = userRepository.findById(id);
		
		if(optional.isPresent()) {
			User dbUser = optional.get();
			
			dbUser.setFirstName(dtoUserIU.getFirstName());
			dbUser.setLastName(dtoUserIU.getLastName());
			
			User updatedUser =  userRepository.save(dbUser);
			
			BeanUtils.copyProperties(updatedUser, dtoUser);
			
			return dtoUser;
		}
		return null;
	}

	@Override
	public DtoLoginResponse login(DtoLoginRequest dtoLoginRequest) {
	    User user = userRepository.findByUsername(dtoLoginRequest.getUsername());
	    DtoLoginResponse response = new DtoLoginResponse();

	    if (user != null && user.getPassword().equals(dtoLoginRequest.getPassword())) {
	        response.setId(user.getId());
	        response.setFirstName(user.getFirstName());
	        response.setLastName(user.getLastName());
	        response.setMessage("Login successful!");
	    } else {
	        response.setMessage("Invalid username or password!");
	    }

	    return response;
	}

	@Override
	public DtoLoginResponse register(DtoRegisterRequest dtoRegisterRequest) {
	    DtoLoginResponse response = new DtoLoginResponse();

	    if (userRepository.findByUsername(dtoRegisterRequest.getUsername()) != null) {
	        response.setMessage("Username already exists!");
	        return response;
	    }

	    User newUser = new User();
	    newUser.setFirstName(dtoRegisterRequest.getFirstName());
	    newUser.setLastName(dtoRegisterRequest.getLastName());
	    newUser.setUsername(dtoRegisterRequest.getUsername());
	    newUser.setPassword(dtoRegisterRequest.getPassword());

	    User saved = userRepository.save(newUser);

	    response.setId(saved.getId());
	    response.setFirstName(saved.getFirstName());
	    response.setLastName(saved.getLastName());
	    response.setMessage("Registration successful!");
	    return response;
	}
}
