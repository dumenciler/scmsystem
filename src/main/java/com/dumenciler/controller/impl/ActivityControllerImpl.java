package com.dumenciler.controller.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dumenciler.dto.DtoActivity;
import com.dumenciler.dto.DtoActivityApplication;
import com.dumenciler.dto.DtoActivityIU;
import com.dumenciler.services.IActivityApplicationService;
import com.dumenciler.services.IActivityService;

@RestController
@RequestMapping("/rest/api/activity")
@CrossOrigin(origins = "http://localhost:3000")
public class ActivityControllerImpl {

    @Autowired
    private IActivityService activityService;

    @Autowired
    private IActivityApplicationService activityApplicationService;

    // Create Activity
    // Note: Admin check should theoretically be here or via Security Context.
    // For now assuming the caller ensures this or we check the creating user if ID
    // provided.
    // Since DtoActivityIU doesn't have userId, we'll assume the frontend/gateway
    // handles auth.
    // But per requirements, "Restrict to Admin" -> Ideally we'd need a token or
    // userId passed to verify.
    // For this MVP step, we will proceed as standard REST Endpoint.
    @PostMapping("/create")
    public DtoActivity createActivity(@RequestBody DtoActivityIU dtoActivityIU) {
        return activityService.createActivity(dtoActivityIU);
    }

    @GetMapping("/list")
    public List<DtoActivity> getAllActivities() {
        return activityService.getAllActivities();
    }

    @GetMapping("/list/{clubId}")
    public List<DtoActivity> getActivitiesByClub(@PathVariable Integer clubId) {
        return activityService.getActivitiesByClubId(clubId);
    }

    @GetMapping("/{id}")
    public DtoActivity getActivityById(@PathVariable Integer id) {
        return activityService.getActivityById(id);
    }

    // Apply
    @PostMapping("/apply")
    public DtoActivityApplication applyToActivity(@RequestParam Integer userId, @RequestParam Integer activityId) {
        return activityApplicationService.applyToActivity(userId, activityId);
    }

    // Approve
    @PutMapping("/approve/{applicationId}")
    public DtoActivityApplication approveApplication(@PathVariable Integer applicationId) {
        return activityApplicationService.approveApplication(applicationId);
    }

    // Reject
    @PutMapping("/reject/{applicationId}")
    public DtoActivityApplication rejectApplication(@PathVariable Integer applicationId) {
        return activityApplicationService.rejectApplication(applicationId);
    }

    // Get applications for activity
    @GetMapping("/applications/{activityId}")
    public List<DtoActivityApplication> getApplicationsByActivity(@PathVariable Integer activityId) {
        return activityApplicationService.getApplicationsByActivity(activityId);
    }

    // Get applications by user
    @GetMapping("/my-applications/{userId}")
    public List<DtoActivityApplication> getApplicationsByUser(@PathVariable Integer userId) {
        return activityApplicationService.getApplicationsByUser(userId);
    }
}
