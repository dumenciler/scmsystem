package com.dumenciler.controller;

import com.dumenciler.dto.DtoClubRegistration;
import java.util.List;

public interface IClubRegistrationController {
    
    // Kullanıcının kulübe başvurması için
    DtoClubRegistration applyToClub(Integer userId, Integer clubId);
    
    // Bir kulübe gelen başvuruları listelemek için
    List<DtoClubRegistration> getRegistrationsByClubId(Integer clubId);

    // --- YENİ EKLENECEK KISIM ---
    DtoClubRegistration approveRegistration(Integer registrationId);
    
    DtoClubRegistration rejectRegistration(Integer registrationId);
    // ----------------------------
    List<DtoClubRegistration> getRegistrationsByUserId(Integer userId);
}