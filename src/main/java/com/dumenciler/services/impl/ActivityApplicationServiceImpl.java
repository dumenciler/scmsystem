package com.dumenciler.services.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dumenciler.dto.DtoActivity;
import com.dumenciler.dto.DtoActivityApplication;
import com.dumenciler.dto.DtoClub;
import com.dumenciler.dto.DtoUser;
import com.dumenciler.entities.Activity;
import com.dumenciler.entities.ActivityApplication;
import com.dumenciler.entities.ClubRegistration;
import com.dumenciler.entities.RegistrationStatus;
import com.dumenciler.entities.User;
import com.dumenciler.repository.ActivityApplicationRepository;
import com.dumenciler.repository.ActivityRepository;
import com.dumenciler.repository.ClubRegistrationRepository;
import com.dumenciler.repository.UserRepository;
import com.dumenciler.services.IActivityApplicationService;

@Service
public class ActivityApplicationServiceImpl implements IActivityApplicationService {

    @Autowired
    private ActivityApplicationRepository applicationRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClubRegistrationRepository clubRegistrationRepository;

    @Override
    public DtoActivityApplication applyToActivity(Integer userId, Integer activityId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        // Check if user is a member of the club
        ClubRegistration registration = clubRegistrationRepository
                .findByUserIdAndClubId(userId, activity.getClub().getId())
                .orElseThrow(() -> new RuntimeException("User is not a member of this club"));

        if (!RegistrationStatus.APPROVED.equals(registration.getStatus())) {
            throw new RuntimeException("User membership is not approved");
        }

        // Check if application already exists
        if (applicationRepository.existsByUserIdAndActivityId(userId, activityId)) {
            throw new RuntimeException("User already applied to this activity");
        }

        ActivityApplication application = new ActivityApplication();
        application.setUser(user);
        application.setActivity(activity);
        application.setStatus(RegistrationStatus.PENDING);
        application.setApplicationDate(LocalDateTime.now());

        ActivityApplication savedApplication = applicationRepository.save(application);
        return toDto(savedApplication);
    }

    @Override
    public DtoActivityApplication approveApplication(Integer applicationId) {
        ActivityApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(RegistrationStatus.APPROVED);
        return toDto(applicationRepository.save(application));
    }

    @Override
    public DtoActivityApplication rejectApplication(Integer applicationId) {
        ActivityApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(RegistrationStatus.REJECTED);
        return toDto(applicationRepository.save(application));
    }

    @Override
    public List<DtoActivityApplication> getApplicationsByActivity(Integer activityId) {
        return applicationRepository.findByActivityId(activityId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DtoActivityApplication> getApplicationsByUser(Integer userId) {
        return applicationRepository.findByUserId(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private DtoActivityApplication toDto(ActivityApplication application) {
        DtoActivityApplication dto = new DtoActivityApplication();
        BeanUtils.copyProperties(application, dto);

        DtoUser dtoUser = new DtoUser();
        BeanUtils.copyProperties(application.getUser(), dtoUser);
        dto.setUser(dtoUser);

        DtoActivity dtoActivity = new DtoActivity();
        BeanUtils.copyProperties(application.getActivity(), dtoActivity);

        // Populate nested club in activity dto
        DtoClub dtoClub = new DtoClub();
        BeanUtils.copyProperties(application.getActivity().getClub(), dtoClub);
        dtoActivity.setClub(dtoClub);

        dto.setActivity(dtoActivity);

        return dto;
    }
}
