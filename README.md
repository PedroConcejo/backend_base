# Backend-Base-API-CRM
REST API to manage customer data for a small shop.

### Install & Update Dependencies

The first time you start the server you may want to make sure you have the dependencies installed, in the right versions. To do so, just go to the terminal and type:

```
$ npm install
```

### Previous Requirements

You need to have a mongoDB server.
If you don't have it installed, you can follow the steps on their official website according to your OS in the following url:

- https://docs.mongodb.com/manual/administration/install-community/

You can also install the mongoDB interface, mongoDB compass in the following url:

- https://docs.mongodb.com/compass/current/

### Environment Variables

The next setup step is to create an `Environment Variable` file `.env` in this folder. We have provided a `.env.example` for you with a sample configuration for both **development** and **production** environments.

Make your own copy\_

```
$ cp .env.example .env
```

And customize the sample params to your needs

- MONGO_URL="mongodb://localhost:27017/"
- MONGO_DB="Backend_Name"
- PORT=3000
- SECRET="mySecretIsSafeWithYourCode"

### Start local Server

You can start your server anytime with:

```
$ npm run start
```

To start the server in a different environment, use:
```
$ npm run **environment**
```

You can choose one of the following environments:
- dev
- staging
- production

You should see something like:

```
Starting up http-server, serving ./
Available on:
  http://127.0.0.1:8080
  http://192.168.43.142:8080
Hit CTRL-C to stop the server
```

To run test use:
```
$ npm run test
```

## MODELS

### USER MODEL

| KEY            | TYPE   | REQUIRED | VALIDATIONS  | DEFAULT   | ENUM       |
| -------------- | ------ | -------- | ------------ | -------   |----------- |
| name           | String | true     |              |           |            |
| surname        | String | true     |              |           |            |
| photo          | String |          |              |           |            |
| email          | String | true     | regex(email) |           |            | 
| nie            | String | true     | regex(nie)   |           |            |
| password       | String |          | min(6)       |           |            |
| role           | String | true     |              | user      | user/admin |
| createdAt      | Number |          |              | Date.now()|            |
| createdBy      | String | true     |              |           |            |
| lastModifiedBy | String |          |              |           |            |


## API ROUTES

Please note that all routes in this API should be called with the `/api` prefix before the endpoint:

```
POST http://DOMAIN/api/URL
```

### AUTHENTICATION ENDPOINTS

| METHOD | URL           | What does it do      | Body                 | Required             |
| ------ | ------------- | -------------------- | -------------------- | -------------------- |
| POST   | `auth/signup` | Create a new user    | user model           |                      |
| POST   | `auth/login`  | Authenticates a user | email and password   |                      |

### ME ENDPOINTS

| METHOD | URL            | What does it do   | Body                 | Required             |
| ------ | -------------- | ----------------- | -------------------- | -------------------- |
| PUT    | `/me`          | Update My Profile | fields to modify     | token                |
| PUT    | `/me/photo`    | Upload Photo      | attach img as img    | token                |
| GET    | `/me`          | Get My Profile    |                      | token                |
| DELETE | `/me`          | Delete My Profile |                      | token                |
| PUT    | `/me/password` | Change password   | new and old password | token                |

### USERS ENDPOINTS

| METHOD | URL              | What does it do       | Params               | Body                 | Required             |
| ------ | --------------   | --------------------- | -------------------- | -------------------- | -------------------- |
| GET    | `users`          | Get all users         |                      |                      | token                |
| GET    | `users/:id`      | Get user by id        | user id              |                      | token, role = admin  |
| PUT    | `users/:id`      | Update user by id     | user id              | fields to modify     | token, role = admin  |
| PUT    | `users/photo/:id`| Update user photo     | attach img as img    | fields to modify     | token, role = admin  |
| DELETE | `users/:id`      | Delete user by id     | user id              |                      | token, role = admin  |


### CREATE DEFAULT DATABASE

You can generate a default database in your developer server anytime with:

```
$ npm run seed
```

You can find the users information in the file `./users.json`

To work with this database, you have to run the development server with:

```
$ npm run dev
```