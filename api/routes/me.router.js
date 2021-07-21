
const router = require('express').Router()

const {
  getMe,
  updateUser,
  deleteMe,
  changePassword,
  updateUserPhoto
} = require('../controllers/me.controller')

router.get('/', getMe)
router.put('/', updateUser)
router.put('/photo', updateUserPhoto)
router.delete('/', deleteMe)
router.put('/password', changePassword)
module.exports = router
