const UserModel = require('../models/users.model')
const { handleError, whoIs } = require('../utils')

module.exports = {
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUser
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
    .then((adminEmail) => {
      (body.lastModifiedBy = adminEmail)
      UserModel
        .findByIdAndUpdate(req.params.id, body, {
          new: true,
          runValidators: true
        })
        .then(response => res.json(response))
        .catch((err) => handleError(err, res))
    })
}
