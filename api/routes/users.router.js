const router = require('express').Router()

const {
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUser
} = require('../controllers/users.controller')

const { roleControl } = require('../utils')

router.get('/', getAllUsers)
router.get('/:id', roleControl, getUserById)
router.delete('/:id', roleControl, deleteUserById)
router.put('/:id', roleControl, updateUser)

module.exports = router
