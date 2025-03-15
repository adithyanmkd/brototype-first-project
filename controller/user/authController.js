import authData from "../../datasets/authData.js"

// get register page 
const getRegister = (req, res) => {
    res.render("user/pages/auth/register.ejs", { layout: "layouts/user-layout.ejs", title: "register", authData })
}


// exporting auth controllers
const authController = {
    getRegister
}

export default authController