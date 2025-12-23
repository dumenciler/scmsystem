package com.dumenciler.services;

import com.dumenciler.dto.DtoClub;
import com.dumenciler.dto.DtoClubIU;

public interface IClubService {
    DtoClub createClub(DtoClubIU dtoClubIU);

    java.util.List<DtoClub> getAllClubs();
}
