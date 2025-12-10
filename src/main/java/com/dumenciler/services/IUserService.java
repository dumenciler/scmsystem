package com.dumenciler.services;

import java.util.List;

import com.dumenciler.dto.DtoLoginRequest;
import com.dumenciler.dto.DtoLoginResponse;
import com.dumenciler.dto.DtoRegisterRequest;
import com.dumenciler.dto.DtoUser;
import com.dumenciler.dto.DtoUserIU;

public interface IUserService {
	public DtoUser saveUser(DtoUserIU student);

	public List<DtoUser> getAllUser();

	public DtoUser getUserById(Integer id);

	public void deleteUser(Integer id);

	public DtoUser updateUser(Integer id, DtoUserIU dtoUserIU);

	public DtoLoginResponse login(DtoLoginRequest dtoLoginRequest);

	public DtoLoginResponse register(DtoRegisterRequest dtoRegisterRequest);

	public String forgotPassword(String email);

	public boolean resetPassword(String token, String newPassword);
}
