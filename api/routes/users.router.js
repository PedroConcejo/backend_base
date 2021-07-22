const router = require('express').Router()

const multer = require('multer')
const storage = multer.diskStorage({
  destination: './public/',
  filename: function (req, file, cb) {
    cb('', Date.now() + '.png')
  }
})
const upload = multer({
  storage: storage
})

const {
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUser,
  updateUserPhoto
} = require('../controllers/users.controller')

const { roleControl } = require('../utils')

router.get('/', getAllUsers)
router.get('/:id', roleControl, getUserById)
router.delete('/:id', roleControl, deleteUserById)
router.put('/:id', roleControl, updateUser)
router.put('/photo/:id', roleControl, upload.single('img'), updateUserPhoto)

module.exports = router
