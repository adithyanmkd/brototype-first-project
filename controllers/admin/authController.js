import authData from "../../datasets/authData.js"


//get login
const getLogin = (req, res) => {
  res.render('admin/pages/auth/login', {
    layout: 'layouts/auth-layout',
    title: 'admin login',
    authData
  })
}

//post admin login
const authenticateAdmin = (req, res) => {
  const { username, password } = req.body

  if (
    username == process.env.ADMIN_NAME &&
    password == process.env.ADMIN_PASS
  ) {
    res.status(200).json({ success: true })
  } else {

    res.status(401).json({ message: 'Invalid credentials' })
  }
}

export default {
  getLogin,
  authenticateAdmin,
}
