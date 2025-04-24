# Apartier 🏠

A modern web application for booking short-stay apartments in Nigeria, built with Node.js, Express, and MySQL.

## Features ✨

- **User Authentication**
  - JWT-based authentication
  - Google OAuth integration
  - Role-based access control (User/Admin)

- **Apartment Management**
  - Browse available apartments
  - Filter by state and price
  - Image upload with Cloudinary
  - Admin apartment creation

- **Booking System**
  - Secure payment via Paystack
  - Real-time payment verification
  - Booking status tracking
  - Payment webhook integration

- **Security**
  - Password encryption with bcrypt
  - JWT token validation
  - Protected API endpoints
  - XSS protection

## Tech Stack 🛠️

### Backend
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MySQL](https://www.mysql.com/)
- [Sequelize ORM](https://sequelize.org/)

### Authentication & Security
- [JSON Web Tokens (JWT)](https://jwt.io/)
- [Passport.js](http://www.passportjs.org/)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)

### Services
- [Cloudinary](https://cloudinary.com/) - Image storage
- [Paystack](https://paystack.com/) - Payment processing
- [Railway](https://railway.app/) - Database hosting

## Installation 🚀

### Install dependencies
- npm install

### Create a .env file with the following variables:
# Database Configuration
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_DIALECT=mysql

# Server Configuration
PORT=3500
NODE_ENV=development

# Authentication
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://127.0.0.1:5500/views/dashboard.html

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Paystack Configuration
PAYSTACK_SECRET_KEY=your_paystack_secret_key

### Start the server
- npm run dev

## API Documentation 📚

### Authentication Endpoints
- POST /api/users/signup - Register new user
- POST /api/users/login - User login
- GET /auth/google - Google OAuth login
- GET /api/users/profile - Get user profile

### Apartment Endpoints
- GET /api/apartments - Get all apartments
- POST /api/apartments - Create new apartment (Admin)
- GET /api/apartments/state/:state - Get apartments by state
- GET /api/apartments/available - Get total available apartments

### Booking Endpoints
- POST /api/bookings - Create new booking
- GET /api/bookings/verify/:reference - Verify payment
- POST /api/bookings/webhook - Paystack webhook handler
- GET /api/bookings/user - Get user's bookings

## Author ✨
- Olamide Sulaimon

## Postman Documentation URL:
https://documenter.getpostman.com/view/41007739/2sB2ixjEC4