package com.dumenciler.controller;

import java.util.List;

import com.dumenciler.dto.DtoUser;
import com.dumenciler.dto.DtoUserIU;

public interface IUserController {
	
public DtoUser saveUser(DtoUserIU dtoUserIU);
	
	public List<DtoUser> getAllUser();
	
	public DtoUser getUserById(Integer id);
	
	public void deleteUser(Integer id);
	
	public DtoUser updateUser(Integer id, DtoUserIU dtoUserIU);
	
}
