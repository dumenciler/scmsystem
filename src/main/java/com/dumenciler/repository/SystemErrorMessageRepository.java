package com.dumenciler.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.dumenciler.entities.SystemErrorMessage;

@Repository
public interface SystemErrorMessageRepository extends JpaRepository<SystemErrorMessage, Integer> {
    SystemErrorMessage findByErrorCode(String errorCode);
}
