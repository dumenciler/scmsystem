package com.dumenciler.controller.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dumenciler.dto.DtoClub;
import com.dumenciler.dto.DtoClubIU;
import com.dumenciler.services.IClubService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/rest/api/club")
public class ClubControllerImpl {

    @Autowired
    private IClubService clubService;

    @PostMapping(path = "/create")
    public DtoClub createClub(@RequestBody DtoClubIU dtoClubIU) {
        return clubService.createClub(dtoClubIU);
    }

    @org.springframework.web.bind.annotation.GetMapping(path = "/list")
    public java.util.List<DtoClub> getAllClubs() {
        return clubService.getAllClubs();
    }
}
