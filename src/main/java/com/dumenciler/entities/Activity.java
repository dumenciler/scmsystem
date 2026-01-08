package com.dumenciler.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "activities", schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "activity_date", nullable = false)
    private LocalDateTime activityDate;

    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;

    // Derived property functionality or stored field?
    // Plan said: active (boolean, derived or explicit).
    // Let's make it explicit for simpler queries, or check date.
    // If we rely on date, we don't need a field. User said "active activity
    // section".
    // Usually active means "date is in the future".
    // Let's add a boolean 'isActive' field for manual cancellation/archival too if
    // needed,
    // but for now relying on date is cleaner for "upcoming vs past".
    // However, user might want to manually disable an event.
    // Let's add 'isActive' field default true.

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;
}
