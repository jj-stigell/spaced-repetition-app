CREATE EXTENSION CITEXT;

-- DOMAIN email makes constraint check that the users email is valid
CREATE DOMAIN valid_email AS CITEXT CHECK ( VALUE ~ '^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$' );

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email valid_email NOT NULL UNIQUE,
  password CHAR(60) NOT NULL,
  username VARCHAR(15) NOT NULL UNIQUE,
  user_created DATE NOT NULL DEFAULT NOW()
);
