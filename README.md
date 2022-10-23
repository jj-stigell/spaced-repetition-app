# Spaced Repetition System app backend
Backend for a [SRS](https://en.wikipedia.org/wiki/Spaced_repetition) app.


## Record of working hours for the Full Stack Open project
Project's record of working hours is in the file workinghours.md.
This file includes only hours spent developing the backend.
Frontend time keeping is in the frontend GitHub repository


# Table of Contents
* [Tech stack](#tech-stack)
* [Libraries](#libraries)
* [TODOs](#todos)
* [Deployment](#deployment)
* [Apollo Server](#apollo-server)


## Tech stack
- [GraphQL](https://graphql.org/)
- [PostgreSQL](https://www.postgresql.org/) database, with [Sequelize](https://sequelize.org/)


## Libraries
- [JSON web token](https://www.npmjs.com/package/jsonwebtoken) or [JWT](https://jwt.io/) for user authorization. [MIT License](https://github.com/auth0/node-jsonwebtoken/blob/HEAD/LICENSE)
- [bcrypt](https://www.npmjs.com/package/bcrypt) for hashing user passwords. [MIT License](https://github.com/kelektiv/node.bcrypt.js/blob/master/LICENSE)
- [validator.js](https://www.npmjs.com/package/validator), validating user input on the server side. [MIT License](https://github.com/validatorjs/validator.js/blob/master/LICENSE)
- [Yup](https://www.npmjs.com/package/yup), Yup is a JavaScript schema builder for value parsing and validation.


## TODOs
- [X] Project base
    - [X] Design database for holding kanji, user, review and word information
    - [X] Create minimal amount of data for the db to be able to proceed with development
    - [X] Set clear project structure
    - [X] Set styling rules on lint etc.
- [ ] Deployment pipeline
    - [X] Run tests with #test
    - [ ] Version numbering (command?)
    - [X] Deploy to production with #deploy
- [ ] GraphQL server
    - [ ] Limit query depth
    - [ ] Set request limit per connection/ip-address
    - [ ] Cache
    - [ ] Catch internal server errors, no (possible) db errors no client
- [ ] Service functionality
    - [ ] User related
        - [ ] User registration
            - [X] Validate input (Validator lib, RegExp, Yup)
            - [ ] Captcha to prevent bots ([reCAPTCHA](https://www.google.com/recaptcha/about/))
            - [X] Check that username, email etc not taken
            - [X] Create user
            - [ ] Email verification ([node mailer](https://nodemailer.com/about/) & [Amazon SES](https://aws.amazon.com/ses/)?)
            - [ ] register using google account
        - [ ] User login, JWT on succesful login, otherwise error
            - [X] Validate input
            - [X] Error on missing, incorrect input, mismatch with password
            - [X] Succesfully create and return token
                - [ ] token content (user id, exp), expiry time?
            - [ ] Keep track of sessions
            - [ ] login using google account
        - [ ] User logout
            - [ ] Delete session
        - [ ] User change password/personal data
            - [X] Old password matches hash in DB
            - [X] Validate new, confirmation must match, cannot be same as old one
            - [ ] send email notification
            - [ ] show open sessions (location, device, expiry date)
            - [ ] delete session
        - [ ] Recover account (e.g. password forgotten)
    - [ ] Card related
        - [ ] Validation of user input, including error messages
            - [ ] Install and configure Yup
            - [ ] Match validation rules with front-end
            - [ ] Card validation
        - [ ] Card mutations
            - [ ] Reschedule card
            - [ ] Add custom card hint
            - [ ] Add custom card story
            - [ ] set deck as favorite (limit?)
            - [ ] Sick day (push all cards +1 day)
            - [ ] Optimize (recalculate deck cards for optimal interval)
        - [ ] Card and deck queries
            - [ ] due cards
            - [ ] new cards
            - [ ] fetch the amount of due cards for the next n days, group by date
            - [ ] fetch available decks, language information, deck specific due cards amount
            - [ ] amount of reviewed kanji (mature or not?)
            - [ ] learnt kanji (x of y)
            - [ ] daily average review count
        - [ ] Reschedule card based on user input (interval, extrareview, etc.)
            - [ ] Reschedule new card by creating new user card
            - [ ] Reschedule due card
            - [ ] Add row to review history
- [ ] misc.
    - [ ] Bug report tool
- [ ] PostgreSQL / Sequelize
    - [X] Translate db to Sequelize
    - [X] Create models and associations
    - [ ] Load initial sql file containing decks, cards and translations
        - [ ] Kanji
        - [ ] Radicals
        - [ ] Words
        - [ ] Translations
        - [ ] Decks
        - [ ] Cards
    - [ ] Add constraints to initial database migration
        - [ ] unique (email, deck names)
        - [ ] range: integers, varchar
    - [ ] DB performance testing
        - [ ] Generate [mock data](https://www.mockaroo.com/)
- [ ] Testing
    - [ ] Unit testing for functions
        - [ ] Helper functions
    - [ ] Integration tests
        - [X] ACCOUNT
            - [X] Account creation
            - [X] Login
            - [X] Password changing
        - [ ] Logout
        - [ ] MUTATIONS
            - [ ] Reschedule card
            - [ ] Add custom card hint
            - [ ] Add custom card story
            - [ ] set deck as favorite
            - [ ] Sick day
            - [ ] Optimize schedule
        - [ ] QUERIES
            - [ ] Fetch due cards
            - [ ] Fetch new cards
            - [ ] Fetch decks
            - [ ] Fetch due per date, one or multiple
        
    

## Deployment
Deployment to done from branch `production` only if tests pass succesfully and deployment is indicated in the commit message. Render fetches automatically changes made to the production branch and releases the newest version of the production version. Currently deployed to [Render](https://render.com/)

**Commands:**
* `#test` runs tests (and deploy if coupled with lower command)
* `#deploy` copies the main branch to production branch if all tests are run and pass, from there render takes over
* with no `#test` and `#deploy` committed changes are just pushed to the main branch


## Apollo Server
[In memory caching](https://www.apollographql.com/docs/apollo-server/performance/cache-backends/)
