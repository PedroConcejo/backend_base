const UserModel = require('../models/users.model')
const { handleError, whoIs, uploadImage } = require('../utils')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const errorsList = require('../diccionario/errores')

module.exports = {
  signup,
  login
}

function signup (req, res) {
  if (Object.keys(req.body).length === 0) {
    return res.status(403).json({
      error: {
        msg: errorsList.errorMessage.ERROR_PARAMS_CAN_NOT_BE_EMPTY,
        code: errorsList.errorCodes.ERROR_PARAMS_CAN_NOT_BE_EMPTY
      }
    })
  }
  if (req.headers.token) {
    whoIs(req)
      .then((adminEmail) => {
        if (adminEmail.role !== 'admin') {
          return res.status(403).json({
            error: {
              msg: errorsList.errorMessage.ERROR_ROLE_NOT_VALID,
              code: errorsList.errorCodes.ERROR_ROLE_NOT_VALID
            }
          })
        }
        signUp(req, res, adminEmail)
      })
  } else {
    signUp(req, res, req.body)
  }
}

function login (req, res) {
  UserModel.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(403).json({
          error: {
            msg: errorsList.errorMessage.ERROR_WRONG_EMAIL + req.body.email,
            code: errorsList.errorCodes.ERROR_WRONG_EMAIL
          }
        })
      }

      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) { handleError(err, res) }
        if (!result) {
          return res.status(403).json({
            error: {
              msg: errorsList.errorMessage.ERROR_WRONG_PASSWORD + req.body.email,
              code: errorsList.errorCodes.ERROR_WRONG_PASSWORD
            }
          })
        }

        const userData = { username: user.name, email: user.email, role: user.role }

        const token = jwt.sign(
          userData,
          process.env.SECRET,
          { expiresIn: '7d' }
        )

        return res.json({ token: token, ...userData })
      })
    })
    .catch(err => handleError(err, res))
}

const signUp = (req, res, createdBy) => {
  uploadImage().then(url => {
    const hashedPwd = bcrypt.hashSync(req.body.password, 10)
    const userBody = {
      name: req.body.name,
      surname: req.body.surname,
      photo: url,
      email: req.body.email,
      password: hashedPwd,
      role: req.body.role,
      nie: req.body.nie,
      createdBy: createdBy.email
    }

    UserModel.create(userBody)
      .then(() => {
        const userData = {
          username: req.body.name,
          email: req.body.email,
          role: req.body.role
        }

        const token = jwt.sign(
          userData,
          process.env.SECRET,
          { expiresIn: '7d' }
        )

        return res.json({ token: token, ...userData })
      })
      .catch(err => {
        var errorData = {}
        if (typeof err.keyPattern === 'object') {
          if (err.keyPattern.email) {
            errorData.email = {
              msg: errorsList.errorMessage.ERROR_EMAIL_DUPLICATE + err.keyValue.email,
              code: errorsList.errorCodes.ERROR_EMAIL_DUPLICATE
            }
          }
          if (err.keyPattern.nie) {
            res.status(403).json({
              error: {
                msg: errorsList.errorMessage.ERROR_NIE_DUPLICATE + err.keyValue.nie,
                code: errorsList.errorCodes.ERROR_NIE_DUPLICATE
              }
            })
          }
        } else {
          for (var property in err.errors) {
            var code = err.errors[property].properties.message
            errorData[property] = {
              msg: errorsList.errorMessage[code],
              code: errorsList.errorCodes[code]
            }
          }
        }
        res.status(403).json({ error: errorData })
      })
  })
}
