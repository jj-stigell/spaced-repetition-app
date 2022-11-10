# Record of working hours

| date | time | worked on  |
| :----:|:-----| :-----|
| 1.9. | 5 | Setting up the project for the backend, creating SQL database schemas |
| 5.9. | 1 | SQL tables for kanji and translations |
| 7.9. | 4 | Working express app with health check, creating utils and graphQL base |
| 8.9. | 5 | Redesign the project to only include GraphQL server, switch to JavaScript for faster prototyping. Create user schema. Add postgre db and sequelize |
| 9.9. | 2 | User sequelize model, validation |
| 10.9. | 3 | Working first version of account creation and user login with validation and JWT |
| 13.9. | 4 | Add all the remaining database tables to migrations and create models. Add associations between models. Automatic loading of precompiled sql file that has initial database, loaded with first migration. |
| 14.9. | 4 | Set database constraints on foreign keys with initial migration, work on raw sql queries for fetching cards, create more mock data for db |
| 6.10. | 1 | Add separate error type and union to login and register mutations. |
| 8.10. | 5 | GraphQL endpoint test for account creation, login, password changing |
| 9.10. | 2 | Github actions deployment and testing pipeline |
| 10.10. | 1 | Github actions deployment and testing pipeline |
| 12.10. | 2 | Write fetch cards resolver and query |
| 15.10. | 2 | Write fetch new cards resolver and query |
| 16.10. | 4 | Write reschedule new and due cards resolver and query  |
| 19.10. | 2 | Rewrite part of the db structure, previous structure did not allow easy expansion for card types |
| 20.20. | 2 | Fix the new relations in the sequelize model |
| 25.10. | 2 | Rewrite fetch card queries |
| 26.10. | 2 | Add yup validation for decks and accounts, update account tests, refactor account mutations |
| 27.10. | 1 | Refactor validation to avoid redundancy. Refactor server to its own module so production and testing can import same server |
| 29.10. | 2 | Update and change deck settings |
| 30.10. | 2 | Push cards n days (all cards or deck specific), edit and add user hints and stories |
| 31.10. | 2 | Fetch due cards and review history grouped by date |
| 1.11. | 3 | Update error handling, refactor account schema to separate resolver and typedefs, create account service |
| 2.11. | 3 | Refactor card resolvers and typedefs, add validators, clean code, add first deck tests |
| 5.11. | 1 | tests and refactoring |
| 8.11. | 1 | validators and dummy data |
| 10.11. | 4 | Add session tracking, bug reporting, query for fetching stats |
|  |  |  |
| total | 72 |  | 