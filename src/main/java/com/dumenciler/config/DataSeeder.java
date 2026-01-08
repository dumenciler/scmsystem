package com.dumenciler.config;

import com.dumenciler.repository.ActivityRepository;
import com.dumenciler.repository.ClubRepository;
import com.dumenciler.entities.Activity;
import com.dumenciler.entities.Club;
import com.dumenciler.repository.ActivityApplicationRepository;
import com.dumenciler.repository.ClubRegistrationRepository;
import com.dumenciler.repository.UserRepository;
import com.dumenciler.entities.ActivityApplication;
import com.dumenciler.entities.ClubRegistration;
import com.dumenciler.entities.RegistrationStatus;
import com.dumenciler.entities.Role;
import com.dumenciler.entities.User;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.ArrayList;
import java.util.Collections;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ClubRepository clubRepository;
    private final ActivityRepository activityRepository;
    private final JdbcTemplate jdbcTemplate;
    private final UserRepository userRepository;
    private final ClubRegistrationRepository clubRegistrationRepository;
    private final ActivityApplicationRepository activityApplicationRepository;

    public DataSeeder(ClubRepository clubRepository,
            ActivityRepository activityRepository,
            JdbcTemplate jdbcTemplate,
            UserRepository userRepository,
            ClubRegistrationRepository clubRegistrationRepository,
            ActivityApplicationRepository activityApplicationRepository) {
        this.clubRepository = clubRepository;
        this.activityRepository = activityRepository;
        this.jdbcTemplate = jdbcTemplate;
        this.userRepository = userRepository;
        this.clubRegistrationRepository = clubRegistrationRepository;
        this.activityApplicationRepository = activityApplicationRepository;
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
                System.out.println("Warning: Could not update sequence: " + e.getMessage());
            }

            System.out.println("Mock clubs seeded successfully with explicit IDs!");
        }

        // --- Activity Seeding ---
        if (activityRepository.count() < 15) {
            // Fetch necessary clubs
            Club club1 = clubRepository.findById(1).orElse(null); // Dümencilik
            Club club2 = clubRepository.findById(2).orElse(null); // Bilgisayar
            Club club3 = clubRepository.findById(3).orElse(null); // Dağcılık
            Club club4 = clubRepository.findById(4).orElse(null); // Havacılık
            Club club5 = clubRepository.findById(5).orElse(null); // Sinema

            // Club 1: Dümencilik
            if (club1 != null) {
                createActivityIfNew("Sektör Buluşması",
                        "Denizcilik sektörünün önde gelen isimleriyle buluşuyoruz.",
                        LocalDateTime.now().plusDays(10), club1, true);

                createActivityIfNew("Mezunlar Paneli",
                        "Eski mezunlarımız deneyimlerini aktarıyor.",
                        LocalDateTime.now().minusWeeks(3), club1, true); // Past but was active
            }

            // Club 2: Bilgisayar (Existing + New)
            if (club2 != null) {
                createActivityIfNew("Spring Boot Workshop",
                        "Spring Boot ile backend geliştirmeye giriş.",
                        LocalDateTime.now().plusDays(5), club2, true);

                createActivityIfNew("Hackathon 2026",
                        "24 saatlik kodlama maratonuna hazır mısın?",
                        LocalDateTime.now().plusWeeks(2), club2, true);

                createActivityIfNew("Java 101",
                        "Geçmiş etkinlik örneği.",
                        LocalDateTime.now().minusMonths(1), club2, false);

                createActivityIfNew("AI & ML Giriş",
                        "Yapay zeka dünyasına ilk adım.",
                        LocalDateTime.now().plusDays(15), club2, true);
            }

            // Club 3: Dağcılık
            if (club3 != null) {
                createActivityIfNew("Uludağ Kış Kampı",
                        "Karda kamp teknikleri ve doğa yürüyüşü.",
                        LocalDateTime.now().plusMonths(1), club3, true);

                createActivityIfNew("Temel Tırmanış Eğitimi",
                        "Duvar tırmanışı temelleri.",
                        LocalDateTime.now().minusWeeks(2), club3, true);
            }

            // Club 4: Havacılık
            if (club4 != null) {
                createActivityIfNew("İHA Yapım Atölyesi",
                        "Kendi dronunu tasarla ve uçur.",
                        LocalDateTime.now().plusWeeks(3), club4, true);

                createActivityIfNew("Simülasyon Yarışması",
                        "Uçuş simülatöründe yeteneklerini göster.",
                        LocalDateTime.now().plusDays(20), club4, true);
            }

            // Club 5: Sinema (Existing + New)
            if (club5 != null) {
                createActivityIfNew("Film Gösterimi: Interstellar",
                        "Bilim kurgu efsanesi Interstellar'ı birlikte izliyoruz.",
                        LocalDateTime.now().plusDays(3), club5, true);

                createActivityIfNew("Oscar Gecesi",
                        "Ödül törenini canlı izliyoruz ve tahminler yapıyoruz.",
                        LocalDateTime.now().plusMonths(2), club5, true);

                createActivityIfNew("Yönetmen Söyleşisi",
                        "Bağımsız sinema üzerine keyifli bir sohbet.",
                        LocalDateTime.now().minusMonths(2), club5, false);
            }

            System.out.println("Mock activities seeded!");
        }

        // --- User Seeding ---
        seedUsers();

        // --- Club Registration Seeding (Memberships & Applications) ---
        seedClubRegistrations();

        // --- Activity Application Seeding ---
        seedActivityApplications();

        // Admin User Seeding
        String adminEmail = "admin@scmsystem.com";
        User adminUser = userRepository.findByEmail(adminEmail);

        if (adminUser != null) {
            if (adminUser.getRole() != Role.ADMIN) {
                adminUser.setRole(Role.ADMIN);
                userRepository.save(adminUser);
                System.out.println("Existing user " + adminEmail + " promoted to ADMIN.");
            }
        } else {
            User newAdmin = new User();
            newAdmin.setEmail(adminEmail);
            newAdmin.setFirstName("Admin");
            newAdmin.setLastName("User");
            newAdmin.setPassword("admin");
            newAdmin.setRole(Role.ADMIN);
            newAdmin.setUsername("admin");

            userRepository.save(newAdmin);
            System.out.println("Admin user created: " + adminEmail + " / admin");
        }
    }

    private void seedUsers() {
        if (userRepository.count() > 5) { // Check if we already have mock users
            return;
        }

        for (int i = 1; i <= 20; i++) {
            String username = "user" + i;
            String email = "user" + i + "@example.com";

            if (userRepository.findByEmail(email) == null) {
                User user = new User();
                user.setFirstName("Mock");
                user.setLastName("User" + i);
                user.setUsername(username);
                user.setEmail(email);
                user.setPassword("1234"); // Simple password for all
                user.setRole(Role.USER);
                userRepository.save(user);
            }
        }
        System.out.println("Mock users seeded!");
    }

    private void seedClubRegistrations() {
        List<User> users = userRepository.findAll();
        List<Club> clubs = clubRepository.findAll();
        Random random = new Random();

        if (users.isEmpty() || clubs.isEmpty())
            return;

        for (User user : users) {
            if (user.getRole() == Role.ADMIN)
                continue; // Skip admin

            // 1. Assign random memberships (APPROVED) - 1 to 3 clubs
            int numMemberships = random.nextInt(3) + 1;
            List<Club> shuffledClubs = new ArrayList<>(clubs);
            Collections.shuffle(shuffledClubs);

            for (int i = 0; i < numMemberships && i < shuffledClubs.size(); i++) {
                Club club = shuffledClubs.get(i);
                createClubRegistrationIfNew(user, club, RegistrationStatus.APPROVED);
            }

            // 2. Assign random applications (PENDING) - 0 to 2 clubs
            // (Use clubs NOT in memberships)
            int numApplications = random.nextInt(3);
            for (int i = numMemberships; i < numMemberships + numApplications && i < shuffledClubs.size(); i++) {
                Club club = shuffledClubs.get(i);
                createClubRegistrationIfNew(user, club, RegistrationStatus.PENDING);
            }
        }
        System.out.println("Mock club registrations seeded!");
    }

    private void createClubRegistrationIfNew(User user, Club club, RegistrationStatus status) {
        boolean exists = clubRegistrationRepository.findAll().stream()
                .anyMatch(cr -> cr.getUser().getId().equals(user.getId()) && cr.getClub().getId().equals(club.getId()));

        if (!exists) {
            ClubRegistration reg = new ClubRegistration();
            reg.setUser(user);
            reg.setClub(club);
            reg.setStatus(status);
            reg.setApplicationDate(LocalDateTime.now().minusDays(new Random().nextInt(30)));
            clubRegistrationRepository.save(reg);
        }
    }

    private void seedActivityApplications() {
        List<User> users = userRepository.findAll();
        List<Activity> activities = activityRepository.findAll();
        Random random = new Random();

        if (users.isEmpty() || activities.isEmpty())
            return;

        for (User user : users) {
            if (user.getRole() == Role.ADMIN)
                continue;

            // Random applications to 0-3 activities
            int numApps = random.nextInt(4);
            List<Activity> shuffledActivities = new ArrayList<>(activities);
            Collections.shuffle(shuffledActivities);

            for (int i = 0; i < numApps && i < shuffledActivities.size(); i++) {
                Activity activity = shuffledActivities.get(i);
                createActivityApplicationIfNew(user, activity, RegistrationStatus.PENDING);
            }
        }
        System.out.println("Mock activity applications seeded!");
    }

    private void createActivityApplicationIfNew(User user, Activity activity, RegistrationStatus status) {
        boolean exists = activityApplicationRepository.findAll().stream()
                .anyMatch(aa -> aa.getUser().getId().equals(user.getId())
                        && aa.getActivity().getId().equals(activity.getId()));

        if (!exists) {
            ActivityApplication app = new ActivityApplication();
            app.setUser(user);
            app.setActivity(activity);
            app.setStatus(status);
            app.setApplicationDate(LocalDateTime.now().minusDays(new Random().nextInt(10)));
            activityApplicationRepository.save(app);
        }
    }

    private void createActivityIfNew(String title, String description, java.time.LocalDateTime date, Club club,
            boolean active) {
        // Simple check to avoid duplicates
        // Assuming findAll() is available from JpaRepository
        boolean exists = false;
        try {
            exists = activityRepository.findAll().stream()
                    .anyMatch(a -> a.getTitle().equals(title));
        } catch (Exception e) {
            // If fails, assume false
        }

        if (exists)
            return;

        Activity activity = new Activity();
        activity.setTitle(title);
        activity.setDescription(description);
        activity.setActivityDate(date);
        activity.setClub(club);
        activity.setActive(active);
        activityRepository.save(activity);
    }
}
