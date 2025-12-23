package com.dumenciler.services.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dumenciler.dto.DtoClubRegistration;
import com.dumenciler.entities.Club;
import com.dumenciler.entities.ClubRegistration;
import com.dumenciler.entities.RegistrationStatus;
import com.dumenciler.entities.User;
import com.dumenciler.repository.ClubRegistrationRepository;
import com.dumenciler.repository.ClubRepository;
import com.dumenciler.repository.UserRepository;
import com.dumenciler.services.IClubRegistrationService;

@Service
public class ClubRegistrationServiceImpl implements IClubRegistrationService {

    @Autowired
    private ClubRegistrationRepository registrationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClubRepository clubRepository;

    @Override
    public DtoClubRegistration applyToClub(Integer userId, Integer clubId) {
        // 1. Kullanıcı ve Kulüp var mı kontrol et
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı ID: " + userId));
        
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Kulüp bulunamadı ID: " + clubId));

        // 2. Zaten başvuru yapmış mı?
        Optional<ClubRegistration> existing = registrationRepository.findByUserIdAndClubId(userId, clubId);
        if (existing.isPresent()) {
            throw new RuntimeException("Bu kulübe zaten başvurunuz bulunmaktadır.");
        }

        // 3. Yeni Başvuru Oluştur
        ClubRegistration registration = new ClubRegistration();
        registration.setUser(user);
        registration.setClub(club);
        registration.setStatus(RegistrationStatus.PENDING); // Varsayılan olarak BEKLEMEDE
        registration.setApplicationDate(LocalDateTime.now());

        ClubRegistration saved = registrationRepository.save(registration);

        // 4. DTO'ya çevirip döndür
        return toDto(saved);
    }

    @Override
    public List<DtoClubRegistration> getRegistrationsByClubId(Integer clubId) {
        List<ClubRegistration> list = registrationRepository.findByClubId(clubId);
        List<DtoClubRegistration> dtoList = new ArrayList<>();
        for (ClubRegistration reg : list) {
            dtoList.add(toDto(reg));
        }
        return dtoList;
    }

    @Override
    public DtoClubRegistration approveRegistration(Integer registrationId) {
        ClubRegistration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Başvuru bulunamadı ID: " + registrationId));
        
        registration.setStatus(RegistrationStatus.APPROVED);
        ClubRegistration updated = registrationRepository.save(registration);
        
        return toDto(updated);
    }

    @Override
    public DtoClubRegistration rejectRegistration(Integer registrationId) {
        ClubRegistration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Başvuru bulunamadı ID: " + registrationId));
        
        registration.setStatus(RegistrationStatus.REJECTED);
        ClubRegistration updated = registrationRepository.save(registration);
        
        return toDto(updated);
    }

    @Override
    public List<DtoClubRegistration> getRegistrationsByUserId(Integer userId) {
        List<ClubRegistration> list = registrationRepository.findByUserId(userId);
        List<DtoClubRegistration> dtoList = new ArrayList<>();
        for (ClubRegistration reg : list) {
            dtoList.add(toDto(reg));
        }
        return dtoList;
    }

    // Yardımcı metod: Entity -> DTO çevrimi
    private DtoClubRegistration toDto(ClubRegistration entity) {
        DtoClubRegistration dto = new DtoClubRegistration();
        BeanUtils.copyProperties(entity, dto);
        
        // BeanUtils id, status, date gibi aynı isimli alanları kopyalar.
        // İlişkili nesnelerin ID ve isimlerini elle set ediyoruz:
        dto.setUserId(entity.getUser().getId());
        dto.setUserName(entity.getUser().getFirstName() + " " + entity.getUser().getLastName());
        dto.setClubId(entity.getClub().getId());
        dto.setClubName(entity.getClub().getName());
        
        return dto;
    }
}