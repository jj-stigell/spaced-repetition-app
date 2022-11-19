INSERT INTO account (email, username, email_verified, password_hash, member, language_id, last_login, created_at, updated_at) VALUES
('admin@test.com', 'adminsUser', false, '$2b$10$jIzSAam1Nc9GDm9ltuKHve/TXl9/w4dSTiZeX0sYMyQpPS0GSRRXG', true, 'EN', NOW(), NOW(), NOW()),
('en@test.com', 'englishTest', false, '$2b$10$jIzSAam1Nc9GDm9ltuKHve/TXl9/w4dSTiZeX0sYMyQpPS0GSRRXG', true, 'EN', NOW(), NOW(), NOW()),
('fi@test.com', 'finnishTest', false, '$2b$10$jIzSAam1Nc9GDm9ltuKHve/TXl9/w4dSTiZeX0sYMyQpPS0GSRRXG', true, 'FI', NOW(), NOW(), NOW());