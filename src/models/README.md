# Database models

## Account

Account model/table consists of:

- id: Auto incremented serial, unique primary key of the account.
- email: Unique VARCHAR(255), validated in frontend, backend (input and sequelize) and database.
- password: Hash string of accounts password, fixed 60 characters.
- username: Unique string, size limited (from 1 to 14 char) and use of symbols. Allow letters (a-z), numbers (0-9), underscore (_), possible japanese char support. `[a-zA-Z0-9_]`.
- member: Boolean to check if account is a member, now default is true. In future there could be somekind of condition for membership.
- email_verified: Boolean to verify account email, default false.
- admin: Boolean to check if admin privileges are activated, should be moved to it of table?
- created_at: Date when account was created.
- updated_at: Date when account was updated last time.
- last_login: When logged in last time.
