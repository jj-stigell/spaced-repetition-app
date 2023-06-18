# Testing in container

Docker environment where backend tests can be executed against a PostgreSQL and Redis instance running in a container.

## Usage

Define a PostgreSQL password in the environment variable POSTGRES_PASSWORD, for example:
```
$ export POSTGRES_PASSWORD="password"
```
Run docker compose in this directory:
```
$ docker-compose up --abort-on-container-exit --exit-code-from back-end-test --build
```

## Running on apple silicon

If you run tests on Apple silicon (M1, M2, etc.) the argon2 package in server `package.json` must be updated to
argon2 version 0.29.0. Version 0.27.2 does not seem to work properly at the moment.

After updating the `package.json`, run command:
```
$ yarn install
```
