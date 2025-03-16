const registerAuthHeading = {
  title: "Join Us Today!",
  description: "Create an account and start your journey with us."
}

const loginAuthHeading = {
  title: "Welcome User",
  description: "We are glad to see you back with us"
}

const adminLoginAuthHeading = {
  title: "Welcome Admin",
  description: "We are glad to see you back with us"
}
const forgetAuthHeading = {
  title: "Forgot Password?",
  description: "Enter your email to receive a password reset link."
}

const authImage = {
  src: "/images/auth/auth-image.svg",
  alt: "auth image"
}

const loginInputFields = [
  {
    icon: {
      iconSrc: '/images/icons/user.svg',
      altText: 'user icon',
    },
    id: 'email',
    name: 'email',
    floatName: "Email",
    type: 'email',
    placeholder: 'Enter your email',
  },
  {
    icon: {
      iconSrc: '/images/icons/lock.svg',
      altText: 'lock icon',
    },
    id: 'password',
    name: 'password',
    floatName: "Password",
    type: 'password',
    placeholder: 'Enter your password',
  },

]

const registerInputFields = [
  {
    icon: {
      iconSrc: '/images/icons/user.svg',
    },
    id: 'fullname',
    name: 'fullname',
    floatName: "Fullname",
    type: 'text',
    placeholder: 'Enter your name',
  },
  ...loginInputFields,
  {
    icon: {
      iconSrc: '/images/icons/lock.svg',
      altText: 'lock icon',
    },
    id: 'confirmPassword',
    name: 'confirmPassword',
    floatName: "Confirm password",
    type: 'password',
    placeholder: 'Enter your password',
  },
]

const adminInputFields = [
  {
    icon: {
      iconSrc: "/images/icons/user.svg",
      altText: "user icon"
    },
    name: "username",
    id: 'username',
    floatName: "Username",
    type: "text",
    placeholder: "Enter your username"
  },
  {
    icon: {
      iconSrc: "/images/icons/lock.svg",
      altText: "lock icon"
    },
    id: 'password',
    name: "password",
    floatName: "Password",
    type: "password",
    placeholder: "Enter your password"
  }
]

const forgetInputFields = [
  {
    icon: {
      iconSrc: '/images/icons/user.svg',
      altText: 'user icon',
    },
    id: 'email',
    name: 'email',
    floatName: "Email",
    type: 'email',
    placeholder: 'Enter your email',
  },
]

const changePassinputFields = [
  {
    icon: {
      iconSrc: '/images/icons/lock.svg',
      altText: 'lock icon',
    },
    id: 'password',
    name: 'newPassword',
    floatName: "New Password",
    type: 'password',
    placeholder: 'Enter new password',
  },
  {
    icon: {
      iconSrc: '/images/icons/lock.svg',
      altText: 'lock icon',
    },
    id: 'confirm-password',
    name: 'confirmPassword',
    floatName: "Confirm Password",
    type: 'password',
    placeholder: 'Confirm new password',
  }
]


const authData = {
  registerAuthHeading,
  authImage,
  loginInputFields,
  registerInputFields,
  loginAuthHeading,
  forgetAuthHeading,
  forgetInputFields,
  changePassinputFields,
  adminLoginAuthHeading,
  adminInputFields
}

export default authData