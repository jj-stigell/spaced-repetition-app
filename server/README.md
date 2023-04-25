# Spaced Repetition System app backend
Backend for a [SRS](https://en.wikipedia.org/wiki/Spaced_repetition) app.


## Record of working hours for the Full Stack Open project
Project's record of working hours is in the file workinghours.md.
This file includes only hours spent developing the backend.
Frontend time keeping is in the frontend GitHub repository


# Table of Contents
* [Setup](#setup)
    * [Environment variables](#environment-variables)
* [Tech stack](#tech-stack)
* [Libraries](#libraries)
* [TODOs](#todos)
* [Deployment](#deployment)
* [Apollo Server](#apollo-server)


## Setup

--

### Environment variables

Running server requires the following environment variables to be set:

`PORT`: The port number that the application will listen to for incoming requests.
`HOST`: The hostname or IP address that the application will be served from.
`NODE_ENV`: The environment in which the application is running (e.g. "development", "production", "testing").
`POSTGRES_USER`: The username used to authenticate with the Postgres database.
`POSTGRES_PASSWORD`: The password used to authenticate with the Postgres database.
`POSTGRES_DATABASE`: The name of the Postgres database that the application will connect to.
`POSTGRES_HOST`: The hostname or IP address of the Postgres server.
`POSTGRES_PORT`: The port number that the Postgres server is listening to.
`EMAIL_ORIGIN`: The email address that will be used as the sender for outgoing emails.
`STMP_HOST`: The hostname of the SMTP server that will be used to send emails.
`STMP_PORT`: The port number that the SMTP server is listening to.
`STMP_USER`: The username used to authenticate with the SMTP server.
`STMP_PASSWORD`: The password used to authenticate with the SMTP server.
`DEV_EMAIL`: The email address that will be used during development, not in production. Must be set if NODE_ENV = development
`JWT_SECRET`: The secret key used to sign and verify JSON Web Tokens.
`FRONTEND_ORIGIN`: The hostname of the frontend application that will be accessing this backend server.

To set environment variables, you can either export them in your terminal or set them in a .env file.

**Exporting environment variables**

To export environment variables in your terminal, use the following format:
```
$ export PORT=value1
$ export HOST=value2
...
```

**Using a .env file**

To set environment variables using a `.env` file, use the example file
`.env.example` in the root directory of your project and add the environment variables.

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
    - [ ] Version numbering
    - [X] Deploy to production with #deploy
- [ ] GraphQL server
    - [ ] Limit query depth
    - [ ] Set request limit per connection/ip-address
    - [ ] Cache
    - [X] Catch internal server errors, no (possible) db errors to client
- [ ] Query and mutation documentation
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
            - [ ] transactions (where needed)
            - [X] Model and realtion to other models
            - [X] query (admin only)
                - [X] fetch all bug reports
                - [X] fetch bug report by id, type etc.
            - [X] mutation
                - [X] post bug report
                - [X] solve bug report (admin only)
                - [X] delete bug report (admin only)
- [ ] PostgreSQL / Sequelize
    - [X] Generate mock data
    - [X] Optimize queries
    - [X] Translate db to Sequelize
    - [X] Create models and associations
    - [X] Load initial sql file containing decks, cards and translations
        - [X] Kanji
        - [X] Radicals
        - [X] Translations
        - [X] Decks
        - [X] Cards
    - [X] Constraints
        - [X] unique (email, admin accountId, deck name, kanji and its card id, radical)
        - [X] range: integers (max intervals etc.), varchar (stories, message etc.)
        - [X] onDelete and onUpdate
    - [X] Enums (defined in constants)
        - review type
        - card type
        - review result type
        - bug type
    - [X] Indexes
        - deck, ['id', 'language_id']
        - deck_translation, ['deck_id', 'language_id']
        - card, ['id', 'language_id']
        - card_list, ['deck_id', 'card_id']
        - account_deck_settings, ['account_id', 'deck_id'],
        - radical_translation, ['radical_id', 'language_id']
        - kanji_radical, ['radical_id', 'kanji_id']
        - kanji_translation, ['kanji_id', 'language_id']
        - word_translation, ['word_id', 'language_id']
        - account_review, ['id', 'account_id', 'card_id']
        - account_card, ['account_id', 'card_id']
        - session, ['id', 'account_id']
        - kanji, ['card_id', 'kanji']
- [ ] Testing
    - [ ] Unit tests
        - [X] Helper functions
        - [ ] Services
            - [ ] account
            - [ ] bug
            - [ ] card
            - [ ] deck
            - [ ] session
    - [ ] Integration tests
        - [X] ACCOUNT
            - [X] Account creation
            - [X] Login
            - [X] Password changing
            - [X] Username changing
            - [X] Logout
        - [ ] CARDS
            - [ ] Mutations
                - [X] Reschedule card
                - [X] Add custom card hint
                - [X] Add custom card story
                - [ ] Sick day (push cards all or in deck)
            - [X] Queries
                - [X] Fetch due cards
                - [X] Fetch new cards
                - [X] Fetch cards by type
                - [X] Fetch due per date, one or multiple
                - [X] Fetch history per card type
         - [X] DECKS
            - [X] Mutations
                - [X] edit deck settings (set favorites, interval, etc.)
            - [X] Queries
                - [X] Fetch decks
                - [X] Fetch deck settings
        - [X] BUGS
            - [X] Mutations
                - [X] create report
                - [X] delete report
                - [X] solve report
            - [X] Queries
                - [X] fetch by id
                - [X] fetch by type
                - [X] fetch all


## Deployment
Deployment to done from branch `production` only if tests pass succesfully and deployment is indicated in the commit message. Render fetches automatically changes made to the production branch and releases the newest version of the production version. Currently deployed to [Render](https://render.com/)

**Commands:**
* `#test` runs tests (and deploy if coupled with lower command)
* `#deploy` copies the main branch to production branch if all tests are run and pass, from there render takes over
* with no `#test` and `#deploy` committed changes are just pushed to the main branch


## Apollo Server
[In memory caching](https://www.apollographql.com/docs/apollo-server/performance/cache-backends/)
