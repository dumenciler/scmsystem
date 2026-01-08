package com.dumenciler.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dumenciler.entities.ActivityApplication;

@Repository
public interface ActivityApplicationRepository extends JpaRepository<ActivityApplication, Integer> {

    // Check if user already applied
    boolean existsByUserIdAndActivityId(Integer userId, Integer activityId);

    // Get application by user and activity
    Optional<ActivityApplication> findByUserIdAndActivityId(Integer userId, Integer activityId);

    // List applications for an activity
    List<ActivityApplication> findByActivityId(Integer activityId);

    // List applications for a user
    List<ActivityApplication> findByUserId(Integer userId);
}
