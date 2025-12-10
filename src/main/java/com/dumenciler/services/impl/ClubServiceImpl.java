package com.dumenciler.services.impl;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dumenciler.dto.DtoClub;
import com.dumenciler.dto.DtoClubIU;
import com.dumenciler.entities.Club;
import com.dumenciler.repository.ClubRepository;
import com.dumenciler.services.IClubService;

@Service
public class ClubServiceImpl implements IClubService {

    @Autowired
    private ClubRepository clubRepository;

    @Override
    public DtoClub createClub(DtoClubIU dtoClubIU) {
        if (clubRepository.findByName(dtoClubIU.getName()) != null) {
            throw new RuntimeException("Club name already exists: " + dtoClubIU.getName());
        }

        Club club = new Club();
        BeanUtils.copyProperties(dtoClubIU, club);

        Club savedClub = clubRepository.save(club);

        DtoClub dtoClub = new DtoClub();
        BeanUtils.copyProperties(savedClub, dtoClub);

        return dtoClub;
    }

    @Override
    public java.util.List<DtoClub> getAllClubs() {
        java.util.List<Club> clubs = clubRepository.findAll();
        java.util.List<DtoClub> dtoClubs = new java.util.ArrayList<>();

        for (Club club : clubs) {
            DtoClub dto = new DtoClub();
            BeanUtils.copyProperties(club, dto);
            dtoClubs.add(dto);
        }
        return dtoClubs;
    }
}
