# Yomiko backend
Backend for a [spaced repetition](https://en.wikipedia.org/wiki/Spaced_repetition) app for studying Japanese.

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

## Setup
--

### Environment variables
Running server requires the following environment variables to be set:

* `PORT`: The port number that the application will listen to for incoming requests.
* `HOST`: The hostname or IP address that the application will be served from.
* `NODE_ENV`: The environment in which the application is running (e.g. "development", "production", "testing").
* `POSTGRES_USER`: The username used to authenticate with the Postgres database.
* `POSTGRES_PASSWORD`: The password used to authenticate with the Postgres database.
* `POSTGRES_DATABASE`: The name of the Postgres database that the application will connect to.
* `POSTGRES_HOST`: The hostname or IP address of the Postgres server.
* `POSTGRES_PORT`: The port number that the Postgres server is listening to.
* `EMAIL_ORIGIN`: The email address that will be used as the sender for outgoing emails.
* `STMP_HOST`: The hostname of the SMTP server that will be used to send emails.
* `STMP_PORT`: The port number that the SMTP server is listening to.
* `STMP_USER`: The username used to authenticate with the SMTP server.
* `STMP_PASSWORD`: The password used to authenticate with the SMTP server.
* `DEV_EMAIL`: The email address that will be used during development, not in production. Must be set if NODE_ENV = development
* `JWT_SECRET`: The secret key used to sign and verify JSON Web Tokens.
* `FRONTEND_ORIGIN`: The hostname of the frontend application that will be accessing this backend server.

To set environment variables, you can either export them in your terminal or set them in a .env file.

**Exporting environment variables**

To export environment variables in your terminal, use the following format:
```
$ export PORT=value1
$ export HOST=value2
...
```

**Using a .env file**

To set environment variables using a `.env` file, use the example file `.env.example`
in the root directory of your project and add the environment variables.

## Tech stack
- [NodeJs](https://nodejs.org/en/), cross-platform JavaScript runtime environment. [License information](https://github.com/nodejs/node/blob/main/LICENSE)
- [PostgreSQL](https://www.postgresql.org/), relational database. [PostgreSQL License](https://www.postgresql.org/about/licence/)

## Libraries
- [Sequelize](https://sequelize.org/), modern TypeScript and Node.js ORM.
- [JWT](https://jwt.io/) for user authentication. [MIT License](https://github.com/auth0/node-jsonwebtoken/blob/HEAD/LICENSE)
- [Yup](https://www.npmjs.com/package/yup), Yup is a JavaScript schema builder for value parsing and validation. [MIT License](https://github.com/jquense/yup/blob/master/LICENSE.md)

## TODOs
Check code for TODOs

## Deployment
Deployment is automated from branch `backend-production`. If tests pass succesfully server code is pushed to the branch.
[Render](https://render.com/) fetches automatically changes made to the branch and releases the newest version of the
production version.
