process.stdout.write('\x1B[2J\x1B[0f') // Clear terminal screen
require('dotenv').config()
var dbName = 'Backend_Name'
switch (process.env.NODE_ENV) {
  case 'dev':
    dbName = process.env.MONGO_DB_DEV
    break
  case 'staging':
    dbName = process.env.MONGO_DB_STAGING
    break
  case 'production':
    dbName = process.env.MONGO_DB_PRODUCTION
    break
  case 'test':
    dbName = process.env.MONGO_DB_TEST
    break
  default:
    dbName = process.env.MONGO_DB_DEV
    break
}

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const path = require('path')

// NONGOOSE
mongoose.connect(process.env.MONGO_URL,
  {
    dbName: dbName,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }, err => {
    if (err) { throw new Error(err) }
    console.info('💾 Connected to Mongo Database \n')
  })

// ADDING MIDDLEWARES & ROUTER
const app = express()
  .use(cors())
  .use(morgan('combined'))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(express.static(path.join(__dirname, 'public')))
  .use('/api', require('./api/routes'))
  .disable('etag')
// Init server
const PORT = process.env.PORT || 2222
const server = app.listen(PORT, (err) => {
  if (err) { throw new Error(err) }
  console.info('>'.repeat(40))
  console.info('💻  Backend Program Server Live')
  console.info(`📡  PORT: http://localhost:${PORT}`)
  console.info('>'.repeat(40) + '\n')
})

module.exports = { mongoose, server }
