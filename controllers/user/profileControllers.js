// import packages
import bcrypt from "bcrypt"

// import models
import User from '../../models/userModel.js'


import menus from '../../datasets/profileMenus.js'

// get user details page
const userDetails = (req, res) => {
    const user = req.session.user
    const userMenus = [...menus] // profile menus accessing

    // google user no need of password change
    if (!user.isGoogleUser) {
        userMenus.splice(1, 0, { name: 'Password', href: '/account/change-password' })
    }

    // if user not registerd
    if (!user) {
        return res.redirect("/auth/login")
    }
    res.render('user/pages/profile/UserDetails', { user, menus: userMenus })
}

// get edit profile page
const getEditProfile = (req, res) => {
    const user = req.session.user
    const userMenus = [...menus] // profile menus accessing

    // google user no need of password change
    if (!user.isGoogleUser) {
        userMenus.splice(1, 0, { name: 'Password', href: '/account/change-password' })
    }
    res.render('user/pages/profile/editProfile', { user, menus: userMenus })
}

// post edit profile page
const postEditProfile = async (req, res) => {
    try {
        const { id } = req.params
        const { name, email, number, gender } = req.body

        const user = await User.find({ email })

        if (user.email) {
            return res.status(404).json({ error: 'User already exists!' })
        }

        // Find the user by ID and update the fields
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                name,
                email,
                number,
                gender,
            },
            { new: true }, // Return the updated document
        )

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' })
        }

        // Update session if needed
        req.session.user = updatedUser

        // Redirect to the profile details page
        res.redirect('/account/my-details')
    } catch (error) {
        console.error('Error updating profile:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

// get password change page
const getPasswordChange = (req, res) => {
    let user = req.session.user
    const userMenus = [...menus] // profile menus accessing

    // google user no need of password change
    if (!user.isGoogleUser) {
        userMenus.splice(1, 0, { name: 'Password', href: '/account/change-password' })
    }

    res.render("user/pages/profile/changePassword", { layout: "layouts/user-layout.ejs", menus: userMenus })
}

// post change password 
const postChangePassword = async (req, res) => {
    const sessionUser = req.session.user
    const dbUser = await User.findById(sessionUser._id)

    // accessing form values
    const oldPassword = req.body.oldPassword
    const newPassword = req.body.newPassword


    const isMatch = await bcrypt.compare(oldPassword, dbUser.password) // checking current password db password

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password.' })
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10) // password hashing
        dbUser.password = hashedPassword
        dbUser.save()
        res.status(200).json({ message: "Password changed successfully" })
    } catch (error) {
        res.status(500).json({ message: "Error while changing password" })
    }


}

// address page
const getAddress = (req, res) => {
    res.render('user/pages/profile/Address')
}

// export profile controller
const profileController = {
    userDetails,
    getEditProfile,
    postEditProfile,
    getAddress,
    getPasswordChange,
    postChangePassword
}
export default profileController
