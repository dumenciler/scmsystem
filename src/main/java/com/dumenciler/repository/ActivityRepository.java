package com.dumenciler.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dumenciler.entities.Activity;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Integer> {

    // Find activities by club, sorted by date descending (newest first)
    List<Activity> findByClubIdOrderByActivityDateDesc(Integer clubId);

    // Find all activities, sorted by date descending
    List<Activity> findAllByOrderByActivityDateDesc();

    // Find upcoming active activities sorted by date ascending
    List<Activity> findByActivityDateAfterAndIsActiveTrueOrderByActivityDateAsc(java.time.LocalDateTime date);
}
