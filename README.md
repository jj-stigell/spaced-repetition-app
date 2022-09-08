# Spaced Repetition System app backend
Backend for a [SRS](https://en.wikipedia.org/wiki/Spaced_repetition) app.

# Record of working hours for the Full Stack Open project
Project's record of working hours is in the file workinghours.md.
This file includes only hours spent developing the backend.
Frontend time keeping is in the frontend GitHub repository

# Planned tech stack, backend
- GraphQL
- PostgreSQL database, with Sequelize
- [JSON web token](https://www.npmjs.com/package/jsonwebtoken) for authentication

# TODOs
- [X] Project base
    - [X] Design database for holding kanji, user, review and word information
    - [X] Create minimal amount of data for the db to be able to proceed with development
    - [X] Set clear project structure
    - [X] Set styling rules on lint etc.
- [ ] GraphQL server
    - [ ] User related
        - [ ] User registration
        - [ ] User login, JWT on succesful login, otherwise error
        - [ ] User logout
        - [ ] Validation of user input, including error messages
    - [ ] Card related
        - [ ] Get cards based on user ID
        - [ ] Reschedule card based on user input
        - [ ] User related
        - [ ] User related
- [ ] PostgreSQL / Sequelize
    - [ ] Translate db to Sequelize
- [ ] Testing
    - [ ] Unit testing
    