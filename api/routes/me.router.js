
const router = require('express').Router()

const {
  getMe,
  updateUser,
  deleteMe,
  changePassword
} = require('../controllers/me.controller')

router.get('/', getMe)
router.put('/', updateUser)
router.delete('/', deleteMe)
router.put('/password', changePassword)
module.exports = router
