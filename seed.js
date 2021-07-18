const seeder = require('mongoose-seed')

require('dotenv').config()

const USERS = require('./users.json')

seeder.connect(process.env.MONGO_URL + process.env.MONGO_DB, function () {
  seeder.loadModels(['api/models/users.model.js'])
  seeder.clearModels(['user'], function () {
    seeder.populateModels(USERS, function () {
      seeder.disconnect()
    })
  })
})
