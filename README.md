# Spaced Repetition System app backend
Backend for a [SRS](https://en.wikipedia.org/wiki/Spaced_repetition) app.

## Record of working hours for the Full Stack Open project
Project's record of working hours is in the file workinghours.md.
This file includes only hours spent developing the backend.
Frontend time keeping is in the frontend GitHub repository

## Tech stack
- [GraphQL](https://graphql.org/)
- [PostgreSQL](https://www.postgresql.org/) database, with [Sequelize](https://sequelize.org/)

## Libraries
- [JSON web token](https://www.npmjs.com/package/jsonwebtoken) or [JWT](https://jwt.io/) for user authorization.
- [bcrypt](https://www.npmjs.com/package/bcrypt) for hashing user passwords.
- [validator.js](https://www.npmjs.com/package/validator), validating user input on the server side.

## TODOs
- [X] Project base
    - [X] Design database for holding kanji, user, review and word information
    - [X] Create minimal amount of data for the db to be able to proceed with development
    - [X] Set clear project structure
    - [X] Set styling rules on lint etc.
- [ ] GraphQL server
    - [ ] User related
        - [ ] User registration
        - [ ] User login, JWT on succesful login, otherwise error
        - [ ] Track sessions?
        - [ ] User logout
        - [ ] Validation of user input, including error messages
    - [ ] Card related
        - [ ] Get cards based on user ID
        - [ ] Reschedule card based on user input
- [ ] PostgreSQL / Sequelize
    - [ ] Translate db to Sequelize
- [ ] Testing
    - [ ] Unit testing
    