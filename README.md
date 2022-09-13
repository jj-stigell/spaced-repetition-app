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
- [JSON web token](https://www.npmjs.com/package/jsonwebtoken) or [JWT](https://jwt.io/) for user authorization. [MIT License](https://github.com/auth0/node-jsonwebtoken/blob/HEAD/LICENSE)
- [bcrypt](https://www.npmjs.com/package/bcrypt) for hashing user passwords. [MIT License](https://github.com/kelektiv/node.bcrypt.js/blob/master/LICENSE)
- [validator.js](https://www.npmjs.com/package/validator), validating user input on the server side. [MIT License](https://github.com/validatorjs/validator.js/blob/master/LICENSE)

## TODOs
- [X] Project base
    - [X] Design database for holding kanji, user, review and word information
    - [X] Create minimal amount of data for the db to be able to proceed with development
    - [X] Set clear project structure
    - [X] Set styling rules on lint etc.
- [ ] GraphQL server
    - [ ] User related
        - [ ] User registration
            - [X] Validate input (Validator lib, RegExp)
            - [ ] Captcha to prevent bots ([reCAPTCHA](https://www.google.com/recaptcha/about/))
            - [X] Check that username, email etc not taken
            - [X] Create user
            - [ ] Email verification ([node mailer](https://nodemailer.com/about/) & [Amazon SES](https://aws.amazon.com/ses/))
        - [ ] User login, JWT on succesful login, otherwise error
            - [X] Validate input
            - [X] Error on missing, incorrect input, mismatch with password
            - [X] Succesfully create and return token
            - [ ] Keep track of sessions
        - [ ] User logout
            - [ ] Delete session
        - [ ] Validation of user input, including error messages
    - [ ] Card related
        - [ ] Get cards based on user ID
        - [ ] Reschedule card based on user input
- [ ] PostgreSQL / Sequelize
    - [X] Translate db to Sequelize
    - [X] Create models and associations
    - [X] Load initial sql file containing precompiled data to database when running first migration
    - [ ] Add constraints to initial database migration
- [ ] Testing
    - [ ] Unit testing for functions
    - [ ] Integration tests
    