const users = [{
  name: 'Pedro',
  surname: 'Concejo',
  photo: 'https://picsum.photos/200',
  email: 'pedro@theagilemonkeys.com',
  nie: '78548019Y',
  password: '123456',
  role: 'admin'
},
{
  name: 'Luis',
  surname: 'Cabrera',
  photo: 'https://picsum.photos/200',
  email: 'luis@theagilemonkeys.com',
  nie: '78548020Y',
  password: '123456',
  role: 'user'
},
{
  name: 'Victoria',
  surname: 'Vera',
  photo: 'https://picsum.photos/200',
  email: 'victoria@theagilemonkeys.com',
  nie: '78548022Y',
  password: '123456',
  role: 'user'
}
]

const newUser = {
  name: 'Laura',
  surname: 'Martinez',
  photo: 'https://picsum.photos/200',
  email: 'laura@theagilemonkeys.com',
  nie: '78548021Y',
  password: '123456',
  role: 'user'
}

const loginAdmin = {
  email: 'pedro@theagilemonkeys.com',
  password: '123456'
}

const loginUser = {
  email: 'luis@theagilemonkeys.com',
  password: '123456'
}

const loginWrongEmail = {
  email: 'paco@theagilemonkeys.com',
  password: '123456'
}
const loginWrongPass = {
  email: 'luis@theagilemonkeys.com',
  password: '654321'
}

const SignUpEmpty = {
    password: '123456'
  }

module.exports = { users, newUser, loginAdmin, loginUser, loginWrongEmail, loginWrongPass, SignUpEmpty }
