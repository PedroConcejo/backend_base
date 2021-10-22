const users = [{
  name: 'Pedro',
  surname: 'Concejo',
  email: 'pedro@backend.com',
  nie: '78548019Y',
  password: '123456',
  role: 'admin'
},
{
  name: 'Luis',
  surname: 'Cabrera',
  email: 'luis@backend.com',
  nie: '78548020Y',
  password: '123456',
  role: 'user'
},
{
  name: 'Victoria',
  surname: 'Vera',
  email: 'victoria@backend.com',
  nie: '78548022Y',
  password: '123456',
  role: 'user'
}
]

const newUser = {
  name: 'Laura',
  surname: 'Martinez',
  email: 'laura@backend.com',
  nie: '78548021Y',
  password: '123456',
  role: 'user'
}

const loginAdmin = {
  email: 'pedro@backend.com',
  password: '123456'
}

const loginUser = {
  email: 'luis@backend.com',
  password: '123456'
}

const loginWrongEmail = {
  email: 'paco@backend.com',
  password: '123456'
}
const loginWrongPass = {
  email: 'luis@backend.com',
  password: '654321'
}

const SignUpEmpty = {
  password: '123456'
}

const newUserName = {
  name: 'Manolo'
}

const changePassword = {
  actualPassword: '123456',
  newPassword: '654321'
}

module.exports = { users, newUser, loginAdmin, loginUser, loginWrongEmail, loginWrongPass, SignUpEmpty, newUserName, changePassword }
