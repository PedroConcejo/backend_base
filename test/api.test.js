const { MongoClient } = require('mongodb')
const supertest = require('supertest')
const { server, mongoose } = require('../index')
const api = supertest(server)
const UsersModel = require('../api/models/users.model')
const errorsList = require('../api/diccionario/errores')
const {
  users,
  newUser,
  loginAdmin,
  loginUser,
  loginWrongEmail,
  loginWrongPass,
  SignUpEmpty
} = require('./helpers')

let connection
var token = 'Token sin añadir'

beforeAll(async () => {
  connection = await MongoClient.connect(process.env.MONGO_URL, {
    useNewUrlParser: true
  })
  await connection.db(process.env.MONGO_DB_TEST)
  await UsersModel.deleteMany({})
})

test('SignUp users from helpers', async () => {
  for (var i = 0; i <= users.length - 1; i++) {
    await api
      .post('/api/auth/signup')
      .send(users[i])
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }
})

test('LogIn user with admin role', async () => {
  const reponse = await api
    .post('/api/auth/login')
    .send(loginAdmin)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  token = reponse.body.token
})

test('Get all users', async () => {
  const response = await api
    .get('/api/users')
    .set('token', token)
  expect(response.body).toHaveLength(users.length)
})

test('SignUp new user', async () => {
  await api
    .post('/api/auth/signup')
    .set('token', token)
    .send(newUser)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('LogIn wrong email', async () => {
  const response = await api
    .post('/api/auth/login')
    .send(loginWrongEmail)
    .expect(403)
  expect(JSON.parse(response.error.text)).toStrictEqual({
    error: {
      msg: errorsList.errorMessage.ERROR_WRONG_EMAIL + loginWrongEmail.email,
      code: errorsList.errorCodes.ERROR_WRONG_EMAIL
    }
  })
})

test('LogIn wrong password', async () => {
  const response = await api
    .post('/api/auth/login')
    .send(loginWrongPass)
    .expect(403)
  expect(JSON.parse(response.error.text)).toStrictEqual({
    error: {
      msg: errorsList.errorMessage.ERROR_WRONG_PASSWORD + loginWrongPass.email,
      code: errorsList.errorCodes.ERROR_WRONG_PASSWORD
    }
  })
})

test('LogIn user without admin role', async () => {
  const reponse = await api
    .post('/api/auth/login')
    .send(loginUser)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  token = reponse.body.token
})

test('SignUp error not admin role trying to create new user', async () => {
  const response = await api
    .post('/api/auth/signup')
    .set('token', token)
    .send(newUser)
    .expect(403)
  expect(JSON.parse(response.error.text)).toStrictEqual({
    error: {
      msg: errorsList.errorMessage.ERROR_ROLE_NOT_VALID,
      code: errorsList.errorCodes.ERROR_ROLE_NOT_VALID
    }
  })
})

test('SignUp error no params', async () => {
  const response = await api
    .post('/api/auth/signup')
    .send({})
    .expect(403)
  expect(JSON.parse(response.error.text)).toStrictEqual({
    error: {
      msg: errorsList.errorMessage.ERROR_PARAMS_CAN_NOT_BE_EMPTY,
      code: errorsList.errorCodes.ERROR_PARAMS_CAN_NOT_BE_EMPTY
    }
  })
})

test('SignUp error some required parameters are missing', async () => {
  const response = await api
    .post('/api/auth/signup')
    .send(SignUpEmpty)
    .expect(403)
  expect(JSON.parse(response.error.text)).toStrictEqual({
    error: {
      name: {
        msg: errorsList.errorMessage.ERROR_NAME_IS_REQUIRED,
        code: errorsList.errorCodes.ERROR_NAME_IS_REQUIRED
      },
      surname: {
        msg: errorsList.errorMessage.ERROR_SURNAME_IS_REQUIRED,
        code: errorsList.errorCodes.ERROR_SURNAME_IS_REQUIRED
      },
      photo: {
        msg: errorsList.errorMessage.ERROR_PHOTO_IS_REQUIRED,
        code: errorsList.errorCodes.ERROR_PHOTO_IS_REQUIRED
      },
      email: {
        msg: errorsList.errorMessage.ERROR_EMAIL_IS_REQUIRED,
        code: errorsList.errorCodes.ERROR_EMAIL_IS_REQUIRED
      },
      nie: {
        msg: errorsList.errorMessage.ERROR_NIE_IS_REQUIRED,
        code: errorsList.errorCodes.ERROR_NIE_IS_REQUIRED
      },
      createdBy: {}
    }
  })
  console.log(response.error.text)
})

afterAll(async () => {
  await connection.close()
  await mongoose.connection.close()
  await server.close()
})
