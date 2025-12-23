package com.dumenciler.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dumenciler.entities.Club;

@Repository
public interface ClubRepository extends JpaRepository<Club, Integer> {
    Club findByName(String name);
}
