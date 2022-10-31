# GraphQL API queries and mutations

All card related queries and murtations require user to be authenticated and jwt to be valid.

* [Queries](#queries)
  * [fetchCards](#fetchcards)
* [Mutations](#mutations)
  * [createAccount](#createaccount)
  * [login](#login)
  * [changePassword](#changepassword)


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


Possible error throwing situations:
  * non-existing deck id provided
  * invalid deck id provided (string type, etc. validation error)
  * no deck id provided
  * invalid language id
  * connection error to db

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


