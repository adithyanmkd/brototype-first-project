document.addEventListener("DOMContentLoaded", () => {
    const pathname = window.location.pathname // pathname accessing



    if (pathname.includes("/auth/register")) userRegister()
    else if (pathname.includes("/auth/otp-verify")) otpVerify()

    let errorTimeout // Store timeout reference

    // display error 
    function displayError(message) {
        const errorBox = document.querySelector("#error-box")

        errorBox.classList.remove("hidden")
        errorBox.textContent = message

        // Clear any existing timeout to prevent multiple timers
        clearTimeout(errorTimeout)

        // after 5 seconds message will be hide
        errorTimeout = setTimeout(() => {
            errorBox.classList.add('hidden')
        }, 5000)
    }

    // hide error message
    function hideError() {
        let errorBox = document.querySelector('#error-box')
        errorBox.classList.add('hidden')
    }


    // user register client validation and sending body data into server
    function userRegister() {
        const userRegisterForm = document.querySelector("#user-register-form")

        // spinner elements
        let loadingSpinner = document.querySelector('#loading-spinner')
        let submitButton = userRegisterForm.querySelector("[type='submit']")
        let buttonText = document.querySelector('#button-text')

        userRegisterForm.addEventListener("submit", async (e) => {
            e.preventDefault()

            // client side validation
            const fullname = userRegisterForm.querySelector("[name='fullname']").value.trim()
            const email = userRegisterForm.querySelector("[name='email']").value.trim()
            const password = userRegisterForm.querySelector("[name='password']").value.trim()
            const confirmPass = userRegisterForm.querySelector("[name='confirmPassword']").value.trim()


            // client side validations
            if (!fullname && !email && !password && !confirmPass) {
                displayError('All fields are required!')
                return
            } else if (!fullname) {
                displayError('Please enter fullname.')
                return
            } else if (!email) {
                displayError('Please enter your email address.')
                return
            } else if (!password) {
                displayError('Please enter your password.')
                return
            } else if (password.length < 6) {
                displayError('password must be 6 characters')
                return
            } else if (!confirmPass) {
                displayError('Please enter confim password.')
                return
            } else if (confirmPass !== password) {
                displayError('Passwords do not match. Please try again!')
                return
            }

            // hide error box
            hideError()

            // show spinner
            submitButton.disabled = true
            buttonText.innerHTML = 'Loading...'
            loadingSpinner.classList.remove('hidden')

            // server side errors
            try {
                let response = await fetch('/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fullname, email, password }),
                })

                let data = await response.json() // converting api json data into javascript object

                if (response.ok) {
                    window.location.href = '/auth/otp-verify'
                } else {
                    displayError(data.error)
                }
            } catch (error) {
                console.log({
                    Error: error,
                    DeveloperNote: 'error while registering user ',
                })
            } finally {
                submitButton.disabled = false
                buttonText.innerHTML = `Register`
                loadingSpinner.classList.add('hidden')
            }

        })
    }

    // otp verify
    function otpVerify() {
        const otpForm = document.querySelector('#otp-form')

        otpForm.addEventListener('submit', async (e) => {
            e.preventDefault()

            const email = otpForm.querySelector("[name='email']").value.trim()
            const otp = otpForm.querySelector('#otp').value.trim()

            let converetd = Number(otp) // converting otp

            if (!otp) {
                displayError('Please enter your otp.')
                return
            } else if (isNaN(converetd)) {
                displayError('Please enter a valid number.')
                return
            }

            // hide error box
            hideError()

            try {
                const response = await fetch('/auth/otp-verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, otp: String(otp) }),
                })

                const data = await response.json()
                console.log(data)

                const isChangingPassword = sessionStorage.getItem('isChangingPassword')

                if (response.ok) {
                    sessionStorage.setItem('successMessage', 'OTP verified successfully!')
                    isChangingPassword
                        ? (window.location.href = '/auth/change-password')
                        : (window.location.href = '/auth/login')
                } else {
                    displayError(data.error)
                }
            } catch (error) {
                console.error({
                    Error: error,
                    DeveloperNote: 'Error from otpVerifty Ajax function',
                })
            }
        })
    }
})