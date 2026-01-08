package com.dumenciler.services.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dumenciler.dto.DtoActivity;
import com.dumenciler.dto.DtoActivityIU;
import com.dumenciler.dto.DtoClub;
import com.dumenciler.entities.Activity;
import com.dumenciler.entities.Club;
import com.dumenciler.repository.ActivityRepository;
import com.dumenciler.repository.ClubRepository;
import com.dumenciler.services.IActivityService;

@Service
public class ActivityServiceImpl implements IActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private ClubRepository clubRepository;

    @Override
    public DtoActivity createActivity(DtoActivityIU dtoActivityIU) {
        Club club = clubRepository.findById(dtoActivityIU.getClubId())
                .orElseThrow(() -> new RuntimeException("Club not found"));

        Activity activity = new Activity();
        BeanUtils.copyProperties(dtoActivityIU, activity);
        activity.setClub(club);
        activity.setActive(true); // Default to active

        Activity savedActivity = activityRepository.save(activity);
        return toDto(savedActivity);
    }

    @Override
    public List<DtoActivity> getAllActivities() {
        return activityRepository.findAllByOrderByActivityDateDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DtoActivity> getActivitiesByClubId(Integer clubId) {
        return activityRepository.findByClubIdOrderByActivityDateDesc(clubId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public DtoActivity getActivityById(Integer id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found"));
        return toDto(activity);
    }

    private DtoActivity toDto(Activity activity) {
        DtoActivity dto = new DtoActivity();
        BeanUtils.copyProperties(activity, dto);

        DtoClub dtoClub = new DtoClub();
        BeanUtils.copyProperties(activity.getClub(), dtoClub);
        dto.setClub(dtoClub);

        return dto;
    }
}
