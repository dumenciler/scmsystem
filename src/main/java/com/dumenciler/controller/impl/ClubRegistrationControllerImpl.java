package com.dumenciler.controller.impl;

import com.dumenciler.controller.IClubRegistrationController;
import com.dumenciler.dto.DtoClubRegistration;
import com.dumenciler.services.IClubRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rest/api/club-registration")
@CrossOrigin(origins = "http://localhost:3000") // Frontend'in erişimine izin veriyoruz
public class ClubRegistrationControllerImpl implements IClubRegistrationController {

    @Autowired
    private IClubRegistrationService registrationService;

    // Örnek istek: POST http://localhost:8082/rest/api/club-registration/apply?userId=1&clubId=5
    @Override
    @PostMapping("/apply")
    public DtoClubRegistration applyToClub(@RequestParam Integer userId, @RequestParam Integer clubId) {
        return registrationService.applyToClub(userId, clubId);
    }

    // Örnek istek: GET http://localhost:8082/rest/api/club-registration/list/5
    @Override
    @GetMapping("/list/{clubId}")
    public List<DtoClubRegistration> getRegistrationsByClubId(@PathVariable Integer clubId) {
        return registrationService.getRegistrationsByClubId(clubId);
    }
    @Override
    @PutMapping("/approve/{registrationId}")
    public DtoClubRegistration approveRegistration(@PathVariable Integer registrationId) {
        return registrationService.approveRegistration(registrationId);
    }

    // Örnek: PUT http://localhost:8082/rest/api/club-registration/reject/5
    @Override
    @PutMapping("/reject/{registrationId}")
    public DtoClubRegistration rejectRegistration(@PathVariable Integer registrationId) {
        return registrationService.rejectRegistration(registrationId);
    }
    @Override
    @GetMapping("/my-registrations/{userId}")
    public List<DtoClubRegistration> getRegistrationsByUserId(@PathVariable Integer userId) {
        return registrationService.getRegistrationsByUserId(userId);
    }
}