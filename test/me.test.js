const { MongoClient } = require('mongodb')
const supertest = require('supertest')
const { server, mongoose } = require('../index')
const api = supertest(server)
const UsersModel = require('../api/models/users.model')
const errorsList = require('../api/diccionario/errores')
const {
  users,
  loginUser,
  newUserName,
  changePassword
} = require('./helpers')

let connection
var token = 'Token sin añadir'
var userId = 'Id sin añadir'

beforeAll(async () => {
  connection = await MongoClient.connect(process.env.MONGO_URL, {
    useNewUrlParser: true
  })
  await connection.db(process.env.MONGO_DB_TEST)
  await UsersModel.deleteMany({})
})

test('Set database for test', async () => {
  for (var i = 0; i <= users.length - 1; i++) {
    await api
      .post('/api/auth/signup')
      .send(users[i])
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }
})

test('LogIn user for test', async () => {
  const response = await api
    .post('/api/auth/login')
    .send(loginUser)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  token = response.body.token
  userId = response.body._id
})

test('Get me', async () => {
  const response = await api
    .get('/api/me')
    .set('token', token)
    .expect(200)
  expect(response.body._id).toBe(userId)
})

test('Modify me', async () => {
  const response = await api
    .put('/api/me')
    .set('token', token)
    .send(newUserName)
    .expect(200)
  expect(response.body.name).toBe(newUserName.name)
})

test('Change password', async () => {
  const response = await api
    .put('/api/me/password')
    .set('token', token)
    .send(changePassword)
    .expect(200)
  expect(response.body.email).toBe(loginUser.email)
})

test('Change password error', async () => {
  const response = await api
    .put('/api/me/password')
    .set('token', token)
    .send(changePassword)
    .expect(403)
  expect(JSON.parse(response.error.text)).toStrictEqual({
    error: {
      msg: errorsList.errorMessage.ERROR_WRONG_PASSWORD + newUserName.name,
      code: errorsList.errorCodes.ERROR_WRONG_PASSWORD
    }
  })
})

test('Delete user by id', async () => {
  const response = await api
    .delete('/api/me')
    .set('token', token)
  expect(response.body).toStrictEqual(
    { n: 1, ok: 1, deletedCount: 1 }
  )
})

afterAll(async () => {
  await connection.close()
  await mongoose.connection.close()
  await server.close()
})
