# Yomiko backend

Backend for a [spaced repetition](https://en.wikipedia.org/wiki/Spaced_repetition) app for studying Japanese.

# Table of Contents

* [Running the app](#running-the-app)
    * [Migrations and seed](#migrations-and-seed)
    * [Running with Docker](#running-with-docker)
    * [Run in production mode](#run-in-production-mode)
    * [Run in development mode](#run-in-development-mode)
    * [Run tests](#run-tests)
    * [Environment variables](#environment-variables)
* [Tech stack and libraries](#tech-stack-and-libraries)
* [TODOs](#todos)
* [Deployment](#deployment)

## Running the app

You can run the backend after building or in development mode, where the backend is restarted automatically everytime
any file has been edited and saved.

### Migrations and seed

Before running the app, make sure database migrations are run correctly and tables are populated with necessary data.
You may have to run the command `$ yarn run build` before running the following commands.

Run database migrations with command:
```
$ yarn run migration:up
```

Run populate database with command:
```
$ yarn run seed:up
```

### Running with Docker

Define a PostgreSQL password in the environment variable POSTGRES_PASSWORD, for example:
```
$ export POSTGRES_PASSWORD="password"
```

Run docker compose in project root:
```
$ docker-compose up --build
```

**NOTE**

If you run tests on Apple silicon (M1, M2, etc.) the argon2 package in server `package.json` must be updated to
argon2 version 0.29.0. Version 0.27.2 does not seem to work properly at the moment.

After updating the `package.json`, run command:
```
$ yarn install
```

### Run in production mode

1. Set environment variables accordingly
2. Run build command `yarn run build`
3. Make sure postgres and redis are running.
4. Run start command `yarn run start`
5. Backend will run at localhost on the port you defined in the encironment variables.

### Run in development mode

1. Set environment variables accordingly
2. Make sure postgres and redis are running.
3. Run command `yarn run dev`
4. Backend will run at localhost on the port you defined in the encironment variables.

### Run tests

1. Set environment variables accordingly.
2. Make sure postgres and redis are running.
3. Run test command `yarn run test`.

You can also run tests in container, see readme file in folder "docker-tests".

### Environment variables

Running server requires the following environment variables to be set:

* `PORT`: Port number that the application will listen to for incoming requests.
* `HOST`: Hostname or IP address that the application will be served from.
* `NODE_ENV`: Environment in which the application is running (e.g. "development", "production", "test").
* `POSTGRES_USER`: Username used to authenticate with the Postgres database.
* `POSTGRES_PASSWORD`: Password used to authenticate with the Postgres database.
* `POSTGRES_DATABASE`: Name of the Postgres database that the application will connect to.
* `POSTGRES_HOST`: Hostname or IP address of the Postgres server.
* `POSTGRES_PORT`: Port number that the Postgres server is listening to.
* `EMAIL_ORIGIN`: Email address that will be used as the sender for outgoing emails.
* `STMP_HOST`: Hostname of the SMTP server that will be used to send emails.
* `STMP_PORT`: Port number that the SMTP server is listening to.
* `STMP_USER`: Username used to authenticate with the SMTP server.
* `STMP_PASSWORD`: Password used to authenticate with the SMTP server.
* `JWT_SECRET`: Secret key used to sign and verify JSON Web Tokens.
* `FRONTEND_URL`: Hostname of the frontend application that will be accessing this backend server.
* `REDIS_HOST`: Redis host.
* `REDIS_PORT`: Redis port.
* `PEPPER`: Pepper for password.

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

## Tech stack and libraries

- [NodeJs](https://nodejs.org/en/), cross-platform JavaScript runtime environment. [License information](https://github.com/nodejs/node/blob/main/LICENSE)
- [PostgreSQL](https://www.postgresql.org/), relational database. [PostgreSQL License](https://www.postgresql.org/about/licence/)
- [Sequelize](https://sequelize.org/), modern TypeScript and Node.js ORM.
- [JWT](https://jwt.io/) for user authentication. [MIT License](https://github.com/auth0/node-jsonwebtoken/blob/HEAD/LICENSE)
- [Yup](https://www.npmjs.com/package/yup), Yup is a JavaScript schema builder for value parsing and validation. [MIT License](https://github.com/jquense/yup/blob/master/LICENSE.md)

## TODOs

Check code for TODOs

## Deployment

Deployment is automated from branch `backend-production`. If tests pass succesfully server code is pushed to the branch.
[Render](https://render.com/) fetches automatically changes made to the branch and releases the newest version of the
production version.
