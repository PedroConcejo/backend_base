const jwt = require('jsonwebtoken')
const UserModel = require('../models/users.model')
const errorsList = require('../diccionario/errores')

// Authenticate Middleware
function authUser (req, res, next) {
  if (!req.headers.token) {
    res.status(403).json({
      error: {
        msg: errorsList.errorMessage.ERROR_TOKEN_NOT_FOUND,
        code: errorsList.errorCodes.ERROR_TOKEN_NOT_FOUND
      }
    })
  } else {
    jwt.verify(req.headers.token, process.env.SECRET, (err, token) => {
      if (err) {
        res.status(403).json({
          error: {
            msg: errorsList.errorMessage.ERROR_TOKEN_NOT_VALID,
            code: errorsList.errorCodes.ERROR_TOKEN_NOT_VALID
          }
        })
      }

      UserModel.findOne({ email: token.email })
        .then(user => {
          res.locals.user = user
          next()
        })
        .catch(err => handleError(err, res))
    })
  }
}

// Return HTTP error with details in JSON
function handleError (err, res) {
  return res.status(400).json(err)
}

function roleControl (req, res, next) {
  if (!req.headers.token) {
    res.status(403).json({
      error: {
        msg: errorsList.errorMessage.ERROR_TOKEN_NOT_FOUND,
        code: errorsList.errorCodes.ERROR_TOKEN_NOT_FOUND
      }
    })
  } else {
    jwt.verify(req.headers.token, process.env.SECRET, (err, token) => {
      if (err) {
        res.status(403).json({
          error: {
            msg: errorsList.errorMessage.ERROR_TOKEN_NOT_VALID,
            code: errorsList.errorCodes.ERROR_TOKEN_NOT_VALID
          }
        })
      }
      if (token.role === 'admin') {
        next()
      } else {
        res.status(403).json({
          error: {
            msg: errorsList.errorMessage.ERROR_ROLE_NOT_VALID,
            code: errorsList.errorCodes.ERROR_ROLE_NOT_VALID
          }
        })
      }
    })
  }
}

function whoIs (req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.headers.token, process.env.SECRET, (_err, token) => {
      resolve(token)
    })
  })
}

async function uploadImage (req, res, next) {
  const imagen = './public/' + req
  var admin = require('firebase-admin')
  var uuid = require('uuid-v4')
  var serviceAccount = require('../../public/serviceAccount.json')
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://the-agile-monkeys.firebaseio.com',
      storageBucket: 'the-agile-monkeys.appspot.com'
    })
  }
  admin.database()
  const bucket = admin.storage().bucket()

  const response = await bucket.upload(imagen, {
    destination: 'images/' + req,
    gzip: true,
    metadata: {
      metadata: {
        // This line is very important. It's to create a download token.
        firebaseStorageDownloadTokens: uuid()
      },
      cacheControl: 'public, max-age=31536000',
      contentType: 'image/png'
    }
  })
  var file = response[0]
  var token = file.metadata.metadata.firebaseStorageDownloadTokens
  var url = 'https://firebasestorage.googleapis.com/v0/b/' + 'the-agile-monkeys.appspot.com' + '/o/' + encodeURIComponent(file.name) + '?alt=media&token=' + token
  const fs = require('fs')
  fs.unlinkSync(imagen)
  return url
}

module.exports = {
  authUser,
  handleError,
  roleControl,
  whoIs,
  uploadImage
}
