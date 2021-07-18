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
      resolve(token.email)
    })
  })
}

module.exports = {
  authUser,
  handleError,
  roleControl,
  whoIs
}
