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
- [NodeJs](https://nodejs.org/en/), cross-platform JavaScript runtime environment. [License information](https://github.com/nodejs/node/blob/main/LICENSE)
- [GraphQL](https://graphql.org/), query language for APIs and a runtime for fulfilling those queries with your existing data. [MIT License](https://github.com/graphql/graphql-js/blob/main/LICENSE)
- [PostgreSQL](https://www.postgresql.org/), relational database. [PostgreSQL License](https://www.postgresql.org/about/licence/)


## Libraries
- [Sequelize](https://sequelize.org/), modern TypeScript and Node.js ORM.
- [JSON web token](https://www.npmjs.com/package/jsonwebtoken) or [JWT](https://jwt.io/) for user authorization. [MIT License](https://github.com/auth0/node-jsonwebtoken/blob/HEAD/LICENSE)
- [bcrypt](https://www.npmjs.com/package/bcrypt), for hashing user passwords. [MIT License](https://github.com/kelektiv/node.bcrypt.js/blob/master/LICENSE)
- [Yup](https://www.npmjs.com/package/yup), Yup is a JavaScript schema builder for value parsing and validation. [MIT License](https://github.com/jquense/yup/blob/master/LICENSE.md)
- [UAParser.js](https://www.npmjs.com/package/ua-parser-js], javaScript library to detect Browser, Engine, OS, CPU, and Device type/model from User-Agent data. [MIT License](https://github.com/faisalman/ua-parser-js/blob/master/license.md)
- [Umzug](https://github.com/sequelize/umzug), framework-agnostic migration tool for Node. It provides a clean API for running and rolling back tasks. [MIT License](https://github.com/sequelize/umzug/blob/main/LICENSE)


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
    - [ ] Catch internal server errors, no (possible) db errors to client
- [ ] Service functionality
    - [ ] User related
        - [ ] transactions (where needed)
        - [X] User registration
            - [X] Validate input (Validator lib, RegExp, Yup)
            - [X] Check that username, email etc not taken
            - [X] Create user
        - [X] User login, JWT on succesful login, otherwise error
            - [X] Validate input
            - [X] Error on missing, incorrect input, mismatch with password
            - [X] add session
            - [X] Succesfully create and return token
                - [X] token content (user id, exp), expiry time set in constants
        - [X] User logout
            - [X] Delete session
        - [X] User change password/personal data
            - [X] Old password matches hash in DB
            - [X] Validate new, confirmation must match, cannot be same as old one
            - [X] show open sessions (location, device, expiry date)
            - [X] delete session
    - [ ] Card related
        - [ ] transactions (where needed)
        - [X] Validation of user input, including error messages
            - [X] Install and configure Yup
            - [X] Match validation rules with front-end
        - [X] Card and deck mutations
            - [X] Reschedule card
            - [X] Add custom card hint
            - [X] Add custom card story
            - [X] Sick day (push all cards +1 day)
            - [X] Edit account deck settings
        - [X] Card and deck queries
            - [X] due cards
            - [X] new cards
            - [X] Fetch account deck settings
            - [X] fetch the amount of due cards for the next n days, group by date
            - [X] fetch the amount of review in the past, group by date
            - [X] fetch available decks, language information, deck specific due cards amount
            - [X] amount of reviewed kanji (mature or not?) (now possible to fetch all cards by type, account cards included)
        - [X] Reschedule card based on user input (interval, extrareview, etc.)
            - [X] Reschedule new card by creating new user card
            - [X] Reschedule due card
            - [X] Add row to review history
    - [ ] misc.
        - [ ] Bug report tool
            - [X] Model and realtion to other models
            - [ ] query (admin only)
                - [ ] fetch all bug reports
                - [ ] fetch bug report by id, type etc.
            - [ ] mutation
                - [ ] post bug report
                - [ ] solve bug report (admin only)
                - [ ] delete bug report (admin only)
- [ ] PostgreSQL / Sequelize
    - [X] Translate db to Sequelize
    - [X] Create models and associations
    - [X] Load initial sql file containing decks, cards and translations
        - [X] Kanji
        - [X] Radicals
        - [X] Translations
        - [X] Decks
        - [X] Cards
    - [ ] Add constraints to initial database migration
        - [ ] unique (email, deck names)
        - [ ] range: integers, varchar
    - [ ] DB testing/optimizing
        - [X] Generate mock data
        - [ ] Optimize queries
        - [ ] Optimize indexes
- [ ] Testing
    - [ ] Unit tests
        - [ ] Helper functions
        - [ ] Services
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
        - [ ] QUERIES
            - [ ] Fetch due cards
            - [ ] Fetch new cards
            - [X] Fetch decks
            - [ ] Fetch due per date, one or multiple
        
    

## Deployment
Deployment to done from branch `production` only if tests pass succesfully and deployment is indicated in the commit message. Render fetches automatically changes made to the production branch and releases the newest version of the production version. Currently deployed to [Render](https://render.com/)

**Commands:**
* `#test` runs tests (and deploy if coupled with lower command)
* `#deploy` copies the main branch to production branch if all tests are run and pass, from there render takes over
* with no `#test` and `#deploy` committed changes are just pushed to the main branch


## Apollo Server
[In memory caching](https://www.apollographql.com/docs/apollo-server/performance/cache-backends/)
