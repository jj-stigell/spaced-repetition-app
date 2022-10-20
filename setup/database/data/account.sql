INSERT INTO account (
  email, email_verified, password_hash, member, language_id, last_login, created_at, updated_at
) VALUES (
    'admin@test.com', false, '$2b$10$GE7OUAW2u2u0WDiJ8nBxIucrIYSV8ZSBU0PCoV.Heg9C5pLnFdqZu', true, 'en', NOW(), NOW(), NOW()
);

INSERT INTO account (
  email, email_verified, password_hash, member, language_id, last_login, created_at, updated_at
) VALUES (
    'en@test.com', false, '$2b$10$GE7OUAW2u2u0WDiJ8nBxIucrIYSV8ZSBU0PCoV.Heg9C5pLnFdqZu', true, 'en', NOW(), NOW(), NOW()
);

INSERT INTO account (
  email, email_verified, password_hash, member, language_id, last_login, created_at, updated_at
) VALUES (
    'fi@test.com', false, '$2b$10$GE7OUAW2u2u0WDiJ8nBxIucrIYSV8ZSBU0PCoV.Heg9C5pLnFdqZu', true, 'fi', NOW(), NOW(), NOW()
);
