# InnoByte Services Frontend

## Description
InnoByte Services is a web application that provides a seamless authentication system using email and OTP verification. This project is built with React, Redux, Chakra UI, and uses React Router for navigation.

## Features
- User Registration with Email and Password
- OTP Verification for Signup
- User Login with Email and Password
- OTP Verification for Login
- Profile Management (View and Edit)
- Protected Routes for Authorized Access

## Technologies Used
- React
- Redux
- Chakra UI
- React Router
- Axios
- Redux Persist

## Prerequisites
Before you begin, ensure you have the following installed:
- Node.js
- npm or yarn

## Getting Started
1. Clone the Repository
    ```bash
    git clone https://github.com/srinivasGokarla/InnoByte
    cd InnoByte
    ```
2. Install Dependencies
    ```bash
    npm install
    ```
    or if you are using yarn:
    ```bash
    yarn install
    ```
3. Running the Application
    To run the application locally, use the following command:
    ```bash
    npm run dev
    ```
    or if you are using yarn:
    ```bash
    yarn start
    ```
    The application will start on http://localhost:3000.


## API Endpoints
The frontend communicates with the backend through the following endpoints:
- POST /api/auth/register: Register a new user
- POST /api/auth/verify-signup-otp: Verify OTP for signup
- POST /api/auth/login: Login a user
- POST /api/auth/verify-login: Verify OTP for login
- POST /api/auth/send-otp: Send OTP for profile update
- POST /api/auth/verify-otp: Verify OTP for profile update
- POST /api/auth/update-profile/:id: Update user profile

## How to Use
### User Registration
1. Navigate to the Signup page.
2. Enter your name, email, and password.
3. Click on the "Register" button.
4. You will receive an OTP in your email.
5. Enter the OTP to verify your account.

### User Login
1. Navigate to the Login page.
2. Enter your email and password.
3. Click on the "Login" button.
4. You will receive an OTP in your email.
5. Enter the OTP to verify your login.

### Profile Management
1. After logging in, navigate to the Profile page.
2. Click on the "Edit" button to update your profile.
3. You will receive an OTP in your email.
4. Enter the OTP to verify your identity.
5. Update your name and password as required.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.

## Contact
For any inquiries or issues, please contact [srinivas@gmail.com].

