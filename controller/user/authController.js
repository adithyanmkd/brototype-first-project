import bcrypt from "bcrypt"
import validator from "validator"

import authData from "../../datasets/authData.js"

//import model
import { User } from '../../model/index.js'
import { generateOTP, sendOTP } from '../../utils/otpHelper.js'

// get register page 
const getRegister = (req, res) => {
    res.render("user/pages/auth/register.ejs", { layout: "layouts/auth-layout.ejs", title: "register", authData })
}

// register new user
const postRegister = async (req, res) => {
    const { fullname, email, password } = req.body // accessing values from form

    const errors = {}

    // email validation
    if (!validator.isEmail(email)) {
        errors.email = 'Invalid email format';
    } else if (/[#&%$*]/.test(email)) {
        errors.email = 'Email must not contain special characters like #, &, %, $, *';
    }

    // If there are errors, return them
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ error: errors.email });
    }


    // hashed password
    const hashedPassword = await bcrypt.hash(password, 10)

    // generate OTP
    const otp = generateOTP()
    const otpExpiry = Date.now() + 10 * 60 * 100 // OTP expires in 10 minutes

    // check is the user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return res.status(409).json({ error: 'User already exists!' })
    }

    try {
        //creating user
        const newUser = new User({
            name: fullname,
            email,
            otp,
            otpExpires: otpExpiry,
            password: hashedPassword,
        })

        await newUser.save() // save new user
        await sendOTP(email, otp) // send OTP to mail
        req.session.tempEmail = email
        res.status(200).json({ success: true })
    } catch (error) {
        res.json({ Error: error })
    }
}

// otp verify page
const getOtpVerify = (req, res) => {
    res.render('user/pages/auth/otpVerify', {
        layout: 'layouts/auth-layout',
        title: 'verify otp',
        email: req.session.tempEmail,
    })
}

// otp validation
const postOtpVerify = async (req, res) => {
    const { email, otp } = req.body // accessing form email and otp
    const user = await User.findOne({ email }) // finding user from database

    try {
        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ error: 'Invalid or expired OTP' })
        }

        // clear OTP field after verification
        user.otp = null
        user.otpExpires = null
        user.isVerified = true

        await user.save() // saving user

        res.status(200).json({ success: true })
    } catch (error) {
        res.json({
            Error: error,
            DeveloperNote: 'Error from post otp verify controller',
        })
    }
}

//resend otp
const getResendOtp = async (req, res) => {
    // generate OTP
    const otp = generateOTP()
    const otpExpiry = Date.now() + 10 * 60 * 100 // OTP expires in 10 minutes

    try {
        const user = await User.findOneAndUpdate(
            { email: req.session.tempEmail }, // Find user by email
            { otp, otpExpires: otpExpiry }, // Update fields
            { new: true }, // Return updated document
        )

        if (!user) {
            req.flash('error', 'User not exist')
            return res.redirect('/otp-verify')
        }

        await sendOTP(user.email, otp) // resending OTP to mail
        res.redirect('/auth/otp-verify')
    } catch (error) {
        res.json({ Error: error })
    }
}


// exporting auth controllers
const authController = {
    getRegister,
    postRegister,
    getOtpVerify,
    postOtpVerify,
    getResendOtp
}

export default authController