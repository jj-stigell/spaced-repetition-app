INSERT INTO account (
  email, email_verified, password_hash, member, language_id, last_login, created_at, updated_at
) VALUES (
    'admin@test.com', false, '$2b$10$jIzSAam1Nc9GDm9ltuKHve/TXl9/w4dSTiZeX0sYMyQpPS0GSRRXG', true, 'en', NOW(), NOW(), NOW()
);

INSERT INTO account (
  email, email_verified, password_hash, member, language_id, last_login, created_at, updated_at
) VALUES (
    'en@test.com', false, '$2b$10$jIzSAam1Nc9GDm9ltuKHve/TXl9/w4dSTiZeX0sYMyQpPS0GSRRXG', true, 'en', NOW(), NOW(), NOW()
);

INSERT INTO account (
  email, email_verified, password_hash, member, language_id, last_login, created_at, updated_at
) VALUES (
    'fi@test.com', false, '$2b$10$jIzSAam1Nc9GDm9ltuKHve/TXl9/w4dSTiZeX0sYMyQpPS0GSRRXG', true, 'fi', NOW(), NOW(), NOW()
);
