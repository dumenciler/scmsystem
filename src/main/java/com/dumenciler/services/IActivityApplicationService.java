package com.dumenciler.services;

import java.util.List;

import com.dumenciler.dto.DtoActivityApplication;

public interface IActivityApplicationService {

    DtoActivityApplication applyToActivity(Integer userId, Integer activityId);

    DtoActivityApplication approveApplication(Integer applicationId);

    DtoActivityApplication rejectApplication(Integer applicationId);

    List<DtoActivityApplication> getApplicationsByActivity(Integer activityId);

    List<DtoActivityApplication> getApplicationsByUser(Integer userId);
}
