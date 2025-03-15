const authHeading = {
    title: "Join Us Today!",
    description: "Create an account and start your journey with us."
}

const authImage = {
    src: "/images/auth/auth-image.svg",
    alt: "auth image"
}

const inputFields = [
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


const authData = {
    authHeading,
    authImage,
    inputFields
}

export default authData