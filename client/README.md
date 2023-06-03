# Yomiko frontend

Frontend for a [spaced repetition](https://en.wikipedia.org/wiki/Spaced_repetition) app for studying Japanese.

## Table of Contents

* [Running the app](#running-the-app)
    * [Environment variables](#environment-variables)
* [Running with Docker](#running-with-docker)
* [Tech stack and libraries](#tech-stack-and-libraries)
* [TODOs](#todos)
* [Deployment](#deployment)

## Running the app

Install the necessary modules at the project root:
```
$ npm install
```

Start the app on local machine, this will expose the app to localhost port [3000](http://localhost:3000/):
```
$ npm run start
```

Create a production optimized build from the project:
```
$ npm run build
```

Tests can be run with the command:
```
$ npm run test
```

### Environment variables

Running frontend requires the following environment variables to be set:

* `REACT_APP_BACKEND`: API server url.
* `NODE_ENV`: The environment in which the application is running (e.g. `development`, `production`, `testing`).

To set environment variables, you can either export them in your terminal or set them in a .env file.

**Exporting environment variables**

To export environment variables in your terminal, use the following format:
```
$ export REACT_APP_BACKEND=value1
$ export NODE_ENV=value2
```

**Using a .env file**

To set environment variables using a `.env` file, use the example file `.env.example`
in the root directory of your project and add the environment variables.

## Running with Docker

You can also run the application with Docker.

To build the Docker image run command in the project root:
```
$ docker build . -t srs-app-client
```

After image has been build you can run the container with command:
```
$ docker run -p 3000:3000 -d srs-app-client
```

App will run in the localhost port [3000](http://localhost:3000/)

## Tech stack and libraries

- [React](https://reactjs.org/) with [typescript](https://www.typescriptlang.org/)
- Forms with [Formik](https://github.com/jaredpalmer/formik) and [Yup](https://github.com/jquense/yup) for validation
- Stylized components with [MUI](https://github.com/mui/material-ui)
- State management with [React Redux](https://react-redux.js.org/)
- Localization with [i18next](https://www.i18next.com/). [MIT License](https://github.com/i18next/i18next/blob/master/LICENSE)

## TODOs

* Fix inconsistencies in the form behavior (register, reset, confirm)
* Captcha to prevent bots ([reCAPTCHA](https://www.google.com/recaptcha/about/))
* [Persist](https://blog.logrocket.com/persist-state-redux-persist-redux-toolkit-react/)
* Testing, unit, integration, E2E
* Add client to the docker setup
* Add password strength indicator in form

## Deployment

Deployment is automated from branch `frontend-production`. If tests pass succesfully server code is pushed to the branch.
[Render](https://render.com/) fetches automatically changes made to the branch and releases the newest version of the
production version.
