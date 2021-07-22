const seeder = require('mongoose-seed')
const bcrypt = require('bcrypt')

require('dotenv').config()

const USERS = require('./users.json')
var usersParse = USERS

for (var i = 0; i <= usersParse[0].documents.length - 1; i++) {
  const hashedPwd = bcrypt.hashSync(usersParse[0].documents[i].password, 10)
  usersParse[0].documents[i].password = hashedPwd
}

seeder.connect(process.env.MONGO_URL + process.env.MONGO_DB_DEV, function () {
  seeder.loadModels(['api/models/users.model.js'])
  seeder.clearModels(['user'], function () {
    seeder.populateModels(USERS, function () {
      seeder.disconnect()
    })
  })
})
