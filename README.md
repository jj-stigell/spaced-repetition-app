# Spaced Repetition System app backend
Backend for a [SRS](https://en.wikipedia.org/wiki/Spaced_repetition) app

# Record of working hours for the Full Stack Open project
Project's record of working hours is in the file workinghours.md.
This file includes only hours spent developing the backend.
Frontend time keeping is in the frontend GitHub repository

# Planned tech stack, backend
- Express using typescript
- PostgreSQL database, with Sequelize
- GraphQL
- Auth/access using JWT

# TODOs
- [ ] Project base
    - [ ] Design database for holding kanji, user, review and word information
    - [ ] Create minimal amount of data for the db to be able to proceed with development
    - [X] Set up Express backend server
    - [ ] Set clear project structure and organize accordingly
    - [X] Set styling rules on lint etc.
- [ ] Development
    - [ ] User signup
    - [ ] Validation of user input and error handling
    - [ ] User login, on succesful login generate JWT, otherwise error message
    - [ ] Fetching cards for the user that are due today
    - [ ] Rescheduling reviewed card
    - [ ] Serving react app production build from /app
- [ ] Testing
    - [ ] Unit testing
    - [ ] E2E testing