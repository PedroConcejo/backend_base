const UserModel = require('../models/users.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const errorsList = require('../diccionario/errores')
const { handleError, whoIs, uploadImage } = require('../utils')

module.exports = {
  getMe,
  updateUser,
  deleteMe,
  changePassword,
  updateUserPhoto
}

function getMe (req, res) {
  checkUser(req, res)
  UserModel
    .find({ _id: res.locals.user._id })
    .then(response => res.json(response))
    .catch((err) => handleError(err, res))
}
function updateUser (req, res) {
  checkUser(req, res)
  var body = req.body
  if (body.role) {
    return res.status(403).json({
      error: {
        msg: errorsList.errorMessage.ERROR_ROLE_NOT_VALID + ': users cannot change user role',
        code: errorsList.errorCodes.ERROR_ROLE_NOT_VALID
      }
    })
  }
  whoIs(req)
    .then((userInfo) => {
      (body.lastModifiedBy = userInfo.email)
      UserModel
        .findByIdAndUpdate(res.locals.user._id, body, {
          new: true,
          runValidators: true
        })
        .then(response => res.json(response))
        .catch((err) => handleError(err, res))
    })
}

function deleteMe (req, res) {
  checkUser(req, res)
  UserModel
    .remove({ _id: res.locals.user._id })
    .then(response => res.json(response))
    .catch(err => handleError(err, res))
}

function changePassword (req, res) {
  checkUser(req, res)
  UserModel
    .findById(res.locals.user._id)
    .then(user => {
      bcrypt.compare(req.body.actualPassword, user.password, (err, result) => {
        if (err) {
          return handleError(err)
        }
        if (!result) {
          return res.status(403).json({
            error: {
              msg: errorsList.errorMessage.ERROR_WRONG_PASSWORD + user.name,
              code: errorsList.errorCodes.ERROR_WRONG_PASSWORD
            }
          })
        }
        const newPassword = bcrypt.hashSync(req.body.newPassword, 10)
        user.password = newPassword
        user.lastModifiedBy = res.locals.user.email
        user.save()
          .then(response => res.json(response))
          .catch((err) => handleError(err, res))
      })
    })
    .catch((err) => handleError(err, res))
}

function updateUserPhoto (req, res) {
  checkUser(req, res)
  uploadImage(req.file.filename).then(url => {
    UserModel
      .findByIdAndUpdate(res.locals.user._id, { photo: url }, {
        new: true,
        runValidators: true
      })
      .then(response => res.json(response))
      .catch((err) => handleError(err, res))
  })
}

function checkUser (req, res) {
  if (!req.headers.token) {
    return res.status(403).json({
      error: {
        msg: errorsList.errorMessage.ERROR_TOKEN_NOT_FOUND,
        code: errorsList.errorCodes.ERROR_TOKEN_NOT_FOUND
      }
    })
  }
  jwt.verify(req.headers.token, process.env.SECRET, (err, token) => {
    if (err) {
      res.status(403).json({
        error: {
          msg: errorsList.errorMessage.ERROR_TOKEN_NOT_VALID,
          code: errorsList.errorCodes.ERROR_TOKEN_NOT_VALID
        }
      })
    }
  })
}
