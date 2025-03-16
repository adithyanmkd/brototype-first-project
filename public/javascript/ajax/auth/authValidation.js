document.addEventListener("DOMContentLoaded", () => {
	const pathname = window.location.pathname // pathname accessing



	if (pathname.includes("/auth/register")) userRegister()
	else if (pathname.includes("/auth/otp-verify")) otpVerify()
	else if (pathname.includes("/admin/auth/login")) adminLogin()
	else if (pathname.includes("/auth/login")) userLogin()
	else if (pathname.includes("/auth/forget-password")) forgetPassword()
	else if (pathname.includes("/auth/change-password")) changePassword()

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

	// show success message
	function displaySuccess(message) {
		let successBox = document.querySelector('#success-box') // accessing success box

		successBox.innerHTML = message
		successBox.classList.remove('hidden')

		// Clear any existing timeout to prevent multiple timers
		clearTimeout(successBox)

		// after 5 seconds message will be hide
		successTimeout = setTimeout(() => {
			successBox.classList.add('hidden')
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
		let countdown;
		const resendBtn = document.getElementById('resend-btn');

		// resendBtn.addEventListener('click', () => {
		// 	startTimer()
		// })

		function startTimer() {
			let timeLeft = 30; // 30 seconds

			// start countdown
			resendBtn.innerText = `${timeLeft}s`;

			countdown = setInterval(() => {
				timeLeft--;

				if (timeLeft > 0) {
					resendBtn.classList.add("text-black")
					resendBtn.innerText = `${timeLeft}s`;
				} else {
					clearInterval(countdown); // Stop timer
					resendBtn.innerText = `Resend`;
					resendBtn.classList.remove("text-black")
					resendBtn.disabled = false; // Enable button
				}
			}, 1000);
		}

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

	// user login client valdation and sending body data into server
	function userLogin() {
		const loginForm = document.querySelector('#user-login-form')
		let successMessage = sessionStorage.getItem('successMessage')

		if (successMessage) {
			displaySuccess(successMessage)
			sessionStorage.removeItem('successMessage')
		}

		loginForm.addEventListener('submit', async (e) => {
			e.preventDefault()

			let email = loginForm.querySelector("[name='email']").value.trim()
			let password = loginForm.querySelector("[name='password']").value.trim()

			// client validations
			if (!email && !password) {
				displayError('Email and password are required.')
				return
			} else if (!email) {
				displayError('Please enter your email address.')
				return
			} else if (!password) {
				displayError('Please enter your password.')
				return
			}

			try {
				// post login form into backend
				let response = await fetch('/auth/login', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email, password }),
				})

				let data = await response.json()

				if (response.ok) {
					window.location.href = '/'
				} else {
					displayError(data.error) // passing error message into display error function
				}
			} catch (error) {
				console.error({
					Error: error,
					DeveloperNote: 'Error from login post ajax',
				})
			}
		})
	}

	// forget password validation & AJAX
	function forgetPassword() {
		const forgetPassForm = document.querySelector('#forget-password-form')
		let loadingSpinner = document.querySelector('#loading-spinner')
		let submitButton = document.querySelector("[type='submit']")
		let buttonText = document.querySelector('#button-text')

		forgetPassForm.addEventListener('submit', async (e) => {
			e.preventDefault()

			let email = forgetPassForm.querySelector("[name='email']").value.trim()

			if (!email) {
				displayError('Please enter your Email.')
				return
			}

			// hide error box
			hideError()

			// show spinner
			submitButton.disabled = true
			buttonText.innerHTML = 'Loading...'
			loadingSpinner.classList.remove('hidden')

			try {
				const response = await fetch('/auth/forget-password', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email }),
				})

				const data = await response.json()

				if (response.ok) {
					sessionStorage.setItem('isChangingPassword', true)
					window.location.href = '/auth/otp-verify'
				} else {
					displayError(data.error)
				}
			} catch (error) {
				console.error({ Error: error, DeveloperNote: "Error in forget password" })
			} finally {
				submitButton.disabled = false
				buttonText.innerHTML = `Send Reset Link`
				loadingSpinner.classList.add('hidden')
			}
		})
	}

	// change password validation & AJAX
	function changePassword() {
		const changePassForm = document.querySelector('#change-password-form')
		let successMessage = sessionStorage.getItem('successMessage')

		if (successMessage) {
			displaySuccess(successMessage)
			sessionStorage.removeItem('successMessage')
		}

		changePassForm.addEventListener('submit', async (e) => {
			e.preventDefault()

			const password = changePassForm.querySelector('#password').value.trim()
			const confirmPassword = changePassForm
				.querySelector('#confirm-password')
				.value.trim()

			// client side form validations
			if (!password && !confirmPassword) {
				displayError('Both fields are required!')
				return
			} else if (!password) {
				displayError('Please enter new password')
				return
			} else if (password.length < 6) {
				displayError('Password must be 6 characters.')
				return
			} else if (!confirmPassword) {
				displayError('Please enter confirm password')
				return
			} else if (confirmPassword !== password) {
				displayError('Passwords do not match. Please try again!')
				return
			}

			// hide error
			hideError()

			try {
				const response = await fetch('/auth/change-password', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ confirmPassword }),
				})

				let data = await response.json()

				if (response.ok) {
					sessionStorage.setItem(
						'successMessage',
						'Password changed successfully.',
					)
					window.location.href = '/auth/login'
				} else {
					displayError(data.message)
				}
			} catch (error) {
				console.error({
					Error: error,
					DeveloperNote: 'Error from change password ajax',
				})
			}
		})
	}

	function adminLogin() {
		const loginForm = document.querySelector('#admin-login-form')

		loginForm.addEventListener('submit', async (e) => {
			e.preventDefault()

			const username = loginForm.querySelector("[name='username']").value.trim()
			const password = loginForm.querySelector("[name='password']").value.trim()

			if (!username && !password) {
				displayError('All field required')
				return
			} else if (!username) {
				displayError('Please enter your username')
				return
			} else if (!password) {
				displayError('Please enter password')
				return
			}

			// hide error box
			hideError()

			try {
				const response = await fetch('/admin/auth/login', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ username, password }),
				})

				const data = await response.json()

				if (response.ok) {
					window.location.href = '/admin'
				} else {
					displayError(data.message)
				}
			} catch (error) {
				console.error({ Error: error })
			}
		})
	}
})