# GraphQL API queries and mutations

All card related queries and murtations require user to be authenticated and jwt to be valid.

* [Queries](#queries)
  * [fetchCards](#fetchcards)
  * [fetchAllBugReports](#fetchallbugreports)
* [Mutations](#mutations)
  * [createAccount](#createaccount)
  * [login](#login)
  * [changePassword](#changepassword)
* [Errors information](#errors-information)


## Queries


### fetchCards

Fetch either cards that are due for review or new cards.

**arguments:**
  * `deckId` deck id, integer <span style="color:red">REQUIRED</span>
  * `languageId` preferred language defaults to english if not provided, string <span style="color:green">OPTIONAL</span>
  * `newCards` fetch due cards or new cards, boolean, defaults to false <span style="color:green">OPTIONAL</span>

**fields:**
  * type name `Account` returned after creating account succesfully
    * `id` newly created user id, integer
    * `email` account email address, string
  * type name `Error` returned if error occurs during query
    * `errorCode` error code reflecting the encountered error, string


**Possible error throwing situations:**
  * non-existing deck id provided
  * invalid deck id provided (string type, etc. validation error)
  * no deck id provided
  * invalid language id
  * connection error to db


**Query:**
```
query {
  fetchCards(
    deckId: 1
    languageId: "en"
    newCards: false
  )
  {
    ... on Error {
      errorCodes
    }
    ... on Cardset {
      Cards {
        id
        type
        createdAt
        updatedAt
        account_cards {
          reviewCount
          easyFactor
          accountStory
          accountHint
          dueDate
        }
        kanji {
          id
          kanji
          jlptLevel
          onyomi
          onyomiRomaji
          kunyomi
          kunyomiRomaji
          strokeCount
          createdAt
          updatedAt
          kanji_translations {
            hint
            keyword
            story
            otherMeanings
          }
          radicals {
            radical
            reading
            readingRomaji
            strokeCount
            createdAt
            updatedAt
            radical_translations {
              translation
              description
              createdAt
              updatedAt
            }
          }
        }
      }
    }
  }
}
```








## fetchAllBugReports

Fetch all submitted bug reports, only accessible to admins with read permission.
Returns array or bug reports.

**fields:**
  * `id` bug report id, integer
  * `accountId` report submitter account id, integer
  * `cardId` report submitter account id, integer
  * `type` type which the bug report concerns (translation, UI, etc.), enum
  * `bugMessage` message describing the encountered bug, max length defined in constants, string
  * `solvedMessage` admin response to the bug, string
  * `solved` id bug solved by admin, boolean
  * `createdAt` date when any bug report was posted by user, string (Date scalar)
  * `updatedAt` date when any row updated in the entry, string (Date scalar)

**Possible error throwing situations:**
  * not authenticated
  * not an admin with read permission
  * connection error to db

**Query:**
```
query {
  fetchAllBugReports {
    id
    accountId
    cardId
    type
    bugMessage
    solvedMessage
    solved
    createdAt
    updatedAt
  }
}
```





## Mutations


### createAccount

Creates a new account.

**arguments:**
  * `password` password, string <span style="color:red">REQUIRED</span>
  * `passwordConfirmation` password confirmation, string <span style="color:red">REQUIRED</span>
  * `email` email, string <span style="color:red">REQUIRED</span>
  * `languageId` preferred language defaults to english if not provided, string <span style="color:green">OPTIONAL</span>

**fields:**
  * type name `Account` returned after creating account succesfully
    * `id` newly created user id, integer
    * `email` account email address, string
  * type name `Error` returned if error occurs during mutation
    * `errorCode` error code reflecting the encountered error, string

Possible error throwing situations:
  * any required value missing
  * username in use
  * email in use
  * password and confirmation do not match
  * password too weak
  * email not valid
  * connection error to db

```
mutation {
  createAccount(
    password: $password
    passwordConfirmation: $passwordConfirmation
    email: $email
    languageId: $languageId
    ) {
    ... on Account {
      id
      email
    }
    ... on Error {
      errorCode
    }
  }
}
```

### login




### changePassword

Change users password, must be loggedin and provide valid JWT

**arguments:**
  * `currentPassword` users current password, string <span style="color:red">REQUIRED</span>
  * `newPassword` new password, string <span style="color:red">REQUIRED</span>
  * `newPasswordConfirmation` new password confirmation, string <span style="color:red">REQUIRED</span>

**fields:**
  * type name `Success` returned after changing password without errors
    * `status` status of the operation, boolean, true if succesfull
  * type name `Error` returned if error occurs during query
    * `errorCodes` error codes reflecting the encountered errors, string array

**Possible error throwing situations:**
  * no valid JWT provided (GraphQL error thrown)
  * new password and confirmation do not match
  * new password does not match the requirements
  * current password does not match with DB hash
  * connection to database fail (GraphQL error thrown)
  * comparing the passwords fail

```
mutation ChangePassword($currentPassword: String!, $newPassword: String!, $newPasswordConfirmation: String!) {
  changePassword(currentPassword: $currentPassword, newPassword: $newPassword, newPasswordConfirmation: $newPasswordConfirmation) {
    ... on Success {
      status
    }
    ... on Error {
      errorCodes
    }
  }
}
```


## Errors information

[graphql errors](https://www.apollographql.com/docs/apollo-server/data/errors/#masking-and-logging-errors)




