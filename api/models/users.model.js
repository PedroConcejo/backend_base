const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'ERROR_NAME_IS_REQUIRED']
  },
  surname: {
    type: String,
    required: [true, 'ERROR_SURNAME_IS_REQUIRED']
  },
  photo: {
    type: String
  },
  email: {
    type: String,
    required: [true, 'ERROR_EMAIL_IS_REQUIRED'],
    validate: {
      validator (value) {
        return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value)
      },
      message: 'ERROR_EMAIL_NOT_VALID'
    },
    unique: [true, 'ERROR_EMAIL_DUPLICATE']
  },
  nie: {
    type: String,
    required: [true, 'ERROR_NIE_IS_REQUIRED'],
    validate: {
      validator (value) {
        return /^\d{8}[a-zA-Z]$/.test(value)
      },
      message: 'ERROR_NIE_NOT_VALID'
    },
    unique: [true, 'ERROR_NIE_DUPLICATE']
  },
  password: {
    type: String,
    minlength: 6
  },
  role: {
    type: String,
    required: true,
    default: 'user',
    enum: ['user', 'admin']
  },
  createdAt: {
    type: Number,
    default: Date.now()
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
})

const userModel = mongoose.model('user', userSchema)
module.exports = userModel
