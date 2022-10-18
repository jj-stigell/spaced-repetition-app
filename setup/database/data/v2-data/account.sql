INSERT INTO account(
  email, email_verified, member, password_hash, language, timezone, last_login, created_at, updated_at
) VALUES (
  'admin@test.com', false, false, '$2b$10$GE7OUAW2u2u0WDiJ8nBxIucrIYSV8ZSBU0PCoV.Heg9C5pLnFdqZu', 'en', 'UTC', NOW(), NOW(), NOW()
);
