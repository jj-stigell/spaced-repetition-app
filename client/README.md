# Table of Contents

* [Running the app](#running-the-app)
    * [Environment variables](#environment-variables)
    * [Running with Docker](#running-with-docker)
* [Tech stack and libraries](#tech-stack-and-libraries)
* [TODOs](#todos)
* [Deployment](#deployment)

## Running the app

Install the necessary modules at the project root:
```
$ yarn install
```

Start the app on local machine (make sure necessary ENV are set), this will expose the app to localhost port [3000](http://localhost:3000/):
```
$ yarn run start
```

Create a production optimized build from the project:
```
$ yarn run build
```

Tests can be run with the command:
```
$ yarn run test
```

### Environment variables

Running frontend requires the following environment variables to be set:

* `REACT_APP_BACKEND`: API server url.
* `NODE_ENV`: The environment in which the application is running (e.g. `development`, `production`, `test`).

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

### Running with Docker

You can also run the application with Docker.

To build the Docker image run command in the project root (might take a while, be patient):
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
- Localization with [i18next](https://www.i18next.com/).
