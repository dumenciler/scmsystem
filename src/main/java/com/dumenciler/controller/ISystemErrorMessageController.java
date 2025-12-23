package com.dumenciler.controller;

import java.util.List;

import com.dumenciler.entities.SystemErrorMessage;

public interface ISystemErrorMessageController {

	
	public List<SystemErrorMessage> getAllMessages();
	
	public SystemErrorMessage getMessageByCode(String Code);
}
