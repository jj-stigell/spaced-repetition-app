# Record of working hours

| date | time | worked on  |
| :----:|:-----| :-----|
| 22.4.2023 | 2 | Combine back- and frontend repositories |
| 23.4.2023 | 2 | Update frontend views |
| 25.4.2023 | 4 | Connect login, register, confirm email, resend confirm email to backend. add axios |
| 26.4.2023 | 2 | Connect reset password to backend, base for settings page |
| 27.4.2023 | 3 | Implement remember me, save selected level to state, fix routing issues, update error and not found pages |
| 28.4.2023 | 4 | update login to return user data, set to state in redux. Refactor components, Change password functionality on back and frontend, change JLPT level functionality |
| 29.4.2023 | 2 | Add redis and decks api endpoint documentation |
| 30.4.2023 | 2 | Add category route and controller. |
| 1.5.2023 | 2 | Add category tests and update docker setup to include redis |
| 5.5.2023 | 2 | update redis config, add data to db, update fetch deck and categories controllers |
| 6.5.2023 | 5 | Persist and clear redux state (depending on action), fetch deck and category information from server |
| 7.5.2023 | 2 | Fix deployment issues, refactor |
| 13.5.2023 | 3 | Add error page for card loading, add reviews finished page, add review page |
| 19.5.2023 | 2 | Use skeleton when loading, move shuffle to redux |
| 3.6.2023 | 3 | Unify theme/styling across client |
| 4.6.2023 | 2 | Enable multilanguage client with i18n, add lang selectors to settings and register views |
|  |  |  |
| total | 35 |  |

# Record of working hours for backend before combining repositories with frontend.

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
| 15.11. | 5 | Add session handling and extract user-agent data for session to help distinguish between sessions. Add all bug report queries and mutations, limit some of the m to admins only |
| 19.11. | 6 | Fix tests, add username, refactor code. Separate tests, add bug testing |
| 6.12. | 4 | Separate deck and cards resolvers, separate seeds from migrations, set up seeder for database, add deck tests |
| 13.12. | 7 | add tests and queries + mutations for testing, add authorization functions, clean old code, reformat code, add helpers |
| 15.12. | 4 | refactor the card resolver, add card translation, add card testing, fix small things |
| 16.12. | 4 | due cards and new cards query tests, expire jwt test |
| 19.12. | 6 | redesign test so after each the db is reset, redesign card resolvers to support multiple review type, separate story and hint from account card. refactor queries and services |
| 20.12. | 2 | add raw queries, update functions, write tests |
| 21.12. | 1 | fix tests, add queries for fetching cards based on previously fetched reviewed card amount |
| 23.12. | 3 | Fix remaining broken tests, update mutation and queries for the tests, update database calls, add new query for counting reviewed due cards this day |
| 24.12. | 1 | Rearrange and categorize the constants and errors |
| 6.1.2023 | 1 | changes to validation and typedefs |
| total | 116 |  | 

# Record of working hours for frontend before combining repositories with backend.

| date | time | worked on  |
| :----:|:-----| :-----|
| 24.9. | 2 | Setting up the project for the frontend |
| 25.9. | 1 | Added NavBar with components, two languages available |
| 28.9. | 4 | Login and logout basic functionality, redux setup with storage |
| 29.9. | 3 | Form-hook for login and register pages with validation, token save to redux store |
| 2.10. | 3 | Redux persisting storage, save user to storage, empty on logout |
| 6.10. | 3 | Error handling for login page, register page functionality and "register success" page after registering. |
| 16.10. | 2 | Routing for components, indentation fixes, creating new deck component |
| 2.1.2023 | 4 | fix broken register and login, set store after login, reset after logout |
| 3.1.2023 | 5 | account page with sessions, change password and general data, sidemenu load from translation, logout button |
| 4.1.2023 | 4 | List all decks, modal for deck settings, fix render issue while using i18n |
| 5.1.2023 | 4 | info tooltips for editing settings, pie chart proto |
| 6.1.2023 | 3 | add graphs to the dashboard (donut, heatmap, list) |
| 7.1.2023 | 2 | frame for study view, tabs for funtionalities, edit account card view with form |
| 8.1.2023 | 6 | study view, load cards based on id, set to store, review one by one |
| total | 46 |  | 
