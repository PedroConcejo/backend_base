const UserModel = require('../models/users.model')
const { handleError, whoIs, uploadImage } = require('../utils')

module.exports = {
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUser,
  updateUserPhoto
}

function getAllUsers (req, res) {
  UserModel
    .find()
    .then(response => res.json(response))
    .catch((err) => handleError(err, res))
}

function getUserById (req, res) {
  UserModel
    .findById(req.params.id)
    .then(response => res.json(response))
    .catch((err) => handleError(err, res))
}

function deleteUserById (req, res) {
  UserModel
    .remove({ _id: req.params.id })
    .then(response => res.json(response))
    .catch(err => handleError(err, res))
}

function updateUser (req, res) {
  var body = req.body
  whoIs(req)
    .then((userLogged) => {
      (body.lastModifiedBy = userLogged.email)
      UserModel
        .findByIdAndUpdate(req.params.id, body, {
          new: true,
          runValidators: true
        })
        .then(response => res.json(response))
        .catch((err) => handleError(err, res))
    })
}

function updateUserPhoto (req, res) {
  var body = req.body
  uploadImage(req.file.filename).then(url => {
    (body.photo = url)
    whoIs(req)
      .then((userLogged) => {
        (body.lastModifiedBy = userLogged.email)
        UserModel
          .findByIdAndUpdate(req.params.id, body, {
            new: true,
            runValidators: true
          })
          .then(response => res.json(response))
          .catch((err) => handleError(err, res))
      })
  })
}
