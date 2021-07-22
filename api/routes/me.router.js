
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
  getMe,
  updateUser,
  deleteMe,
  changePassword,
  updateUserPhoto
} = require('../controllers/me.controller')

router.get('/', getMe)
router.put('/', updateUser)
router.put('/photo', upload.single('img'), updateUserPhoto)
router.delete('/', deleteMe)
router.put('/password', changePassword)
module.exports = router
