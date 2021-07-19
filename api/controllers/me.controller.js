const UserModel = require('../models/users.model')
const bcrypt = require('bcrypt')
const errorsList = require('../diccionario/errores')

const { handleError, whoIs } = require('../utils')

module.exports = {
  getMe,
  updateUser,
  deleteMe,
  changePassword
}

function getMe (req, res) {
  UserModel
    .find({ _id: res.locals.user._id })
    .then(response => res.json(response))
    .catch((err) => handleError(err, res))
}
function updateUser (req, res) {
  var body = req.body
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
  UserModel
    .remove({ _id: res.locals.user._id })
    .then(response => res.json(response))
    .catch(err => handleError(err, res))
}

function changePassword (req, res) {
  UserModel
    .findById(res.locals.user._id)
    .then(user => {
      bcrypt.compare(req.body.actualPassword, user.password, (err, result) => {
        if (err) {
          return handleError(err)
        }
        if (!result) {
          return res.json({
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
