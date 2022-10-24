# GraphQL API queries and mutations

* [Queries](#queries)
* [Mutations](#mutations)
  * [createAccount](#createaccount)
  * [login](#login)
  * [changePassword](#changepassword)


## Queries


## Mutations


### createAccount

Creates a new account.

**arguments:**
  * `password` password, string <span style="color:red">REQUIRED</span>
  * `passwordConfirmation` password confirmation, string <span style="color:red">REQUIRED</span>
  * `email` email, string <span style="color:red">REQUIRED</span>
  * `languageId` preferred language, string <span style="color:green">OPTIONAL</span>

**fields:**
  * type name `Account` returned after creating account succesfully
    * `id` newly created user id, integer
    * `email` account email address, string
  * type name `Error` returned after creating account succesfully
    * `errorCode` error code reflecting the encountered error, string

Possible error throwing situations:
  * any required value missing
  * username in use
  * email in use
  * password and confirmation do not match
  * password too weak
  * email not valid

```
mutation {
  createAccount(
    password: "password",
    passwordConfirmation: "passwordConfirmation"
    email: "api@email.com"
    languageId: "en"
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


