# Yomiko client

## Table of Contents

- [Introduction](#introduction)
- [Built with](#built-with)
- [Running the app](#running-the-app)
- [Running with Docker](#running-with-docker)
- [TODOs](#todos)

## Introduction

--

## Built with

- [React](https://reactjs.org/) with [typescript](https://www.typescriptlang.org/) and [Node.js](https://nodejs.org/en/)
- Forms with [Formik](https://github.com/jaredpalmer/formik) and [Yup](https://github.com/jquense/yup) validation
- Stylized components with [MUI](https://github.com/mui/material-ui)
- [React Redux](https://react-redux.js.org/)
- [i18next](https://www.i18next.com/) i18next is an internationalization-framework written in and for JavaScript. [MIT License](https://github.com/i18next/i18next/blob/master/LICENSE)

## Running the app

Install the necessary Node.js modules at the project root:
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


## TODOs
- [X] Project base
    - [X] Install react and required dependencies
    - [X] Set clear project structure
    - [X] Set styling rules on lint etc.
    - [X] Environment variables
- [ ] Frontend Components (with functionality)
    - [ ] Navbar
    - [X] Login page
    - [X] Logout
    - [ ] Dashboard
    - [ ] Settings
    - [X] Sign up page
    - [ ] Language selector
- [ ] Styling
    - [ ] Navbar
    - [X] Login page
    - [ ] Logout
    - [ ] Dashboard
    - [ ] Settings
    - [X] Sign up page
    - [ ] Language selector
    - [ ] Animations
- [ ] Backend communications
    - [ ] User related
        - [ ] User registration
            - [X] Validate input, with React-hook-form, if bypassed notification component used backend error messages.
            - [ ] Captcha to prevent bots ([reCAPTCHA](https://www.google.com/recaptcha/about/))
            - [X] Check that username, email etc not taken
            - [X] Register user
            - [ ] Email verification ([node mailer](https://nodemailer.com/about/) & [Amazon SES](https://aws.amazon.com/ses/))
        - [X] User login, JWT on succesful login, otherwise error
            - [X] Validate input
            - [X] Error on missing, incorrect input, mismatch with password
            - [X] Succesfully login, token and user saved to redux store
        - [X] User logout
            - [X] Send session termination request to backend
            - [X] Empty token and user data from redux store
        - [X] User change password
            - [X] Validate new data, confirmation must match, cannot be same as old one
        - [ ] Recover account (e.g. password forgotten)
        - [X] Validation of user input, including error messages
    - [ ] Card related
        - [ ] Get cards based on user ID
        - [ ] Reschedule card based on user input
- [ ] Redux
    - [ ] Reducers
        - [ ] User
            - [X] User data
            - [X] Token
            - [X] Session
            - [X] Update information
        - [X] Theme/customization UI
        - [ ] Cards
    - [ ] Storage
        - [X] [Persist](https://blog.logrocket.com/persist-state-redux-persist-redux-toolkit-react/)
        - [ ] Merging
- [ ] Testing
    - [ ] Unit testing for functions
    - [ ] Integration tests
    - [ ] e2e testing
