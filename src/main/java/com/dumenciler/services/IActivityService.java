package com.dumenciler.services;

import java.util.List;

import com.dumenciler.dto.DtoActivity;
import com.dumenciler.dto.DtoActivityIU;

public interface IActivityService {

    DtoActivity createActivity(DtoActivityIU dtoActivityIU);

    List<DtoActivity> getAllActivities();

    List<DtoActivity> getActivitiesByClubId(Integer clubId);

    DtoActivity getActivityById(Integer id);
}
