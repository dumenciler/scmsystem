package com.dumenciler.controller.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.dumenciler.controller.ISystemErrorMessageController;
import com.dumenciler.entities.SystemErrorMessage;
import com.dumenciler.repository.SystemErrorMessageRepository;

@RestController
@RequestMapping("/rest/api/system-messages")
public class SystemErrorMessageControllerImpl implements ISystemErrorMessageController {

    @Autowired
    private SystemErrorMessageRepository messageRepository;

    @GetMapping("/list")
    public List<SystemErrorMessage> getAllMessages() {
        return messageRepository.findAll();
    }

    @GetMapping("/{code}")
    public SystemErrorMessage getMessageByCode(@PathVariable String code) {
        return messageRepository.findByErrorCode(code);
    }
}
