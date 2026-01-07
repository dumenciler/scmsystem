package com.dumenciler.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dumenciler.entities.ClubRegistration;

@Repository
public interface ClubRegistrationRepository extends JpaRepository<ClubRegistration, Integer> {

    // Bir kullanıcının bir kulübe zaten başvurup başvurmadığını kontrol etmek için
    Optional<ClubRegistration> findByUserIdAndClubId(Integer userId, Integer clubId);

    // Bir kulübe ait tüm başvuruları listelemek için (Admin paneli için lazım olacak)
    List<ClubRegistration> findByClubId(Integer clubId);

    List<ClubRegistration> findByUserId(Integer userId);
}