package com.dumenciler.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.dumenciler.services.IEmailService;

@Service
public class SmtpEmailService implements IEmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Override
    public void sendResetPasswordEmail(String toInfo, String resetUrl) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("scm.system@example.com");
        message.setTo(toInfo);
        message.setSubject("Password Reset Request");
        message.setText("Click the link to reset your password: " + resetUrl);

        javaMailSender.send(message);
    }
}
