package com.dumenciler.services;

public interface IEmailService {
    void sendResetPasswordEmail(String toInfo, String resetUrl);
}
