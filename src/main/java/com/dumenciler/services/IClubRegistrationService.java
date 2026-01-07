package com.dumenciler.services;

import com.dumenciler.dto.DtoClubRegistration;
import java.util.List;

public interface IClubRegistrationService {
    
    DtoClubRegistration applyToClub(Integer userId, Integer clubId);
    
    List<DtoClubRegistration> getRegistrationsByClubId(Integer clubId);

    // --- YENİ EKLENECEK KISIM ---
    DtoClubRegistration approveRegistration(Integer registrationId);
    
    DtoClubRegistration rejectRegistration(Integer registrationId);
    // ----------------------------

    List<DtoClubRegistration> getRegistrationsByUserId(Integer userId);
}