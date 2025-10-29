package com.dumenciler.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "system_error_messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemErrorMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "error_code", nullable = false, unique = true)
    private String errorCode;

    @Column(name = "message", nullable = false)
    private String message;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;
}
