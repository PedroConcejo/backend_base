const { MongoClient } = require('mongodb')
const supertest = require('supertest')
const { server, mongoose } = require('../index')
const api = supertest(server)
const UsersModel = require('../api/models/users.model')
const errorsList = require('../api/diccionario/errores')
const {
  users,
  loginAdmin,
  loginUser,
  newUserName
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
})

test('Get all users by user', async () => {
  const response = await api
    .get('/api/users')
    .set('token', token)
  expect(response.body).toHaveLength(users.length)
  userId = response.body[2]._id
})

test('Get user by id, error user role cannot get user by id', async () => {
  const response = await api
    .get('/api/users/' + userId)
    .set('token', token)
    .expect(403)
  expect(JSON.parse(response.error.text)).toStrictEqual({
    error: {
      msg: errorsList.errorMessage.ERROR_ROLE_NOT_VALID,
      code: errorsList.errorCodes.ERROR_ROLE_NOT_VALID
    }
  })
})

test('LogIn admin for test', async () => {
  const reponse = await api
    .post('/api/auth/login')
    .send(loginAdmin)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  token = reponse.body.token
})

test('Get all users by admin', async () => {
  const response = await api
    .get('/api/users')
    .set('token', token)
  expect(response.body).toHaveLength(users.length)
})

test('Get user by id', async () => {
  const response = await api
    .get('/api/users/' + userId)
    .set('token', token)
  expect(response.body._id).toBe(userId)
})

test('Modify user by id', async () => {
  const response = await api
    .put('/api/users/' + userId)
    .set('token', token)
    .send(newUserName)
  expect(response.body.name).toBe(newUserName.name)
})

test('Delete user by id', async () => {
  const response = await api
    .delete('/api/users/' + userId)
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
