The Student Management System
***
Masterwork by _Arda Gönüllü_, _Berk Erdoğan_ and _Özgür Ağar_
***

*Projede PostgreSql veritabanı kullanılmaktadır. Lütfen scmsystem adlı sql database'i kurduktan sonra aşağıdaki kodu çalıştırınız.*

CREATE TABLE public.system_error_messages (
    id SERIAL PRIMARY KEY,
    error_code VARCHAR(255) NOT NULL UNIQUE,
    message VARCHAR(255) NOT NULL,
    created_at TIMESTAMP
);

Container yapısı gelecek sprintler için düşünülmektedir.
