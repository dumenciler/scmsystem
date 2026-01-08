# Student Management System (SCM)

Masterwork by **Arda Gönüllü**, **Berk Erdoğan**, and **Özgür Ağar**.

This project contains a **Spring Boot** backend and a **Next.js** frontend.

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

Ensure you have the following installed:
- **Java** 17 or higher
- **Node.js** 18 or higher
- **PostgreSQL** (Database: `scmsystem`, User: `postgres`, Password: `1234`)

### 1. Database Setup

1. Create a PostgreSQL database named `scmsystem`.
2. Execute the following SQL to create the necessary error messages table:
   ```sql
   CREATE TABLE public.system_error_messages (
       id SERIAL PRIMARY KEY,
       error_code VARCHAR(255) NOT NULL UNIQUE,
       message VARCHAR(255) NOT NULL,
       created_at TIMESTAMP
   );
   ```
3. The application uses `DataSeeder.java` to automatically populate mock data (Clubs, Users, Activities) on startup if the database is empty.

### 2. Running the Backend

Open a terminal in the root directory and run:

```bash
./mvnw spring-boot:run
```

The backend server will start at `http://localhost:8080`.

### 3. Running the Frontend

Open a new terminal, navigate to the web directory, and start the development server:

```bash
cd scmsystem-web
npm install
npm run dev
```

The frontend will start at `http://localhost:3000`.

---

## 🔑 Default Credentials

The system will verify or create these users on startup:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@scmsystem.com` | `admin` |
| **User** | `user1@example.com` | `1234` |
| ... | `user20@example.com` | `1234` |

---

## 🏗 Project Structure

- `src/main/java`: Spring Boot Backend source code.
- `scmsystem-web`: Next.js Frontend application.
- `docs`: Project documentation and architecture summary.

> **Note**: Containerization (Docker) is planned for future sprints.
