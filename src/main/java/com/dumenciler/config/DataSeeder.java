package com.dumenciler.config;

import com.dumenciler.repository.ClubRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ClubRepository clubRepository;
    private final JdbcTemplate jdbcTemplate;

    public DataSeeder(ClubRepository clubRepository, JdbcTemplate jdbcTemplate) {
        this.clubRepository = clubRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        if (clubRepository.count() == 0) {
            // Use JdbcTemplate to explicitly insert IDs, overriding GenerationType.IDENTITY
            // limitations in JPA
            Object[][] data = {
                    { 1, "Dümencilk Kulübü", "Dümencilik ile ilgili her şey burada.", "https://example.com/logo1.png" },
                    { 2, "Bilgisayar Biilimleri Kulübü", "Yazılım ve teknoloji tutkunları için.",
                            "https://example.com/logo2.png" },
                    { 3, "Dağcılık Kulübü", "Zirveye ulaşmak isteyenler.", "https://example.com/logo3.png" },
                    { 4, "Havacılık Kulübü", "Gökyüzü bizi bekliyor.", "https://example.com/logo4.png" },
                    { 5, "Sinema Kulübü", "Film severlerin buluşma noktası.", "https://example.com/logo5.png" }
            };

            for (Object[] club : data) {
                jdbcTemplate.update(
                        "INSERT INTO clubs (id, name, description, logo_link) VALUES (?, ?, ?, ?)",
                        club[0], club[1], club[2], club[3]);
            }

            // Update sequence to prevent conflicts with future inserts
            try {
                jdbcTemplate.execute("SELECT setval('clubs_id_seq', 5, true)");
            } catch (Exception e) {
                // Ignore if sequence naming convention differs, though this is standard for
                // Postgres + Serial
                System.out.println("Warning: Could not update sequence: " + e.getMessage());
            }

            System.out.println("Mock clubs seeded successfully with explicit IDs!");
        }
    }
}
