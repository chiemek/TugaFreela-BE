## Overview

TugaFreela is a freelancer marketplace backend built with **Node.js**, **Express**, and **MongoDB**. It provides authentication, user management, OTP verification, profile management, and contact handling functionalities.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- Cloudinary account (for image uploads)
- Twilio account (for SMS OTP)
- Gmail account (for email services)

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd tugaFreela-be
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a .env file** in the root directory with the following variables:

   ```env
   # Database
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/tugafreela

   # JWT
   JWT_SECRET=your_jwt_secret_key

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Twilio
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890

   # Email
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password

   # Server
   PORT=5000
   ```

## Project Structure

```
tugaFreela-be/
├── configs/              # Configuration files
│   ├── cloudinaryConfig.js
│   ├── db.js
│   ├── multer.js
│   └── nodmailer.js
├── controllers/          # Route controllers
│   ├── authController.js
│   ├── contactController.js
│   ├── profileController.js
│   └── userController.js
├── middlewares/          # Express middlewares
│   └── auth.js
├── models/               # Database models
│   ├── contact.js
│   ├── login.js
│   ├── otpModel.js
│   └── user.js
├── routes/               # API routes
│   ├── auth.js
│   ├── contact.js
│   ├── index.js
│   ├── profile.js
│   └── user.js
├── service/              # Business logic services
│   ├── otpConfig.js
│   ├── otpServices.js
│   └── routeOtp.js
├── app.js                # Express app initialization
├── server.js             # Server entry point
└── package.json          # Project dependencies
```

## Available Scripts

### Development

```bash
npm run dev
```

Runs the server with Nodemon for automatic restarts on file changes.

### Production

```bash
npm start
```

Runs the server using `node server.js`.

## API Endpoints

### Authentication (`/auth`)

- **POST** `/auth/signup` - User registration
- **POST** `/auth/login` - User login
- **POST** `/auth/forgot-password` - Request password reset

### OTP Services

- **POST** `/send-sms-otp` - Send OTP via SMS
- **POST** `/send-email-otp` - Send OTP via email
- **POST** `/verify-otp` - Verify OTP code

### Profile (`/profile`)

- **GET** `/profile` - Get user profile (requires authentication)
- **POST** `/profile/upload-profile-picture` - Upload profile picture (requires authentication)

### Contact (`/contact`)

- **POST** `/contact/contact-us` - Submit contact form

### User (`/user`)

- **GET** `/user/:id` - Get user by ID
- **PUT** `/user/:id` - Update user (requires authentication)
- **DELETE** `/user/:id` - Delete user (requires authentication)

## Key Features

### Authentication & Security

- JWT-based authentication
- Password hashing with bcryptjs
- Rate limiting (5 requests per 15 minutes)
- Security headers with Helmet
- CORS configuration

### OTP Verification

- SMS OTP via Twilio
- Email OTP via Nodemailer
- 15-minute OTP expiration
- Input validation (phone numbers and emails)

### File Management

- Profile picture uploads to Cloudinary
- Multer for file handling
- Memory storage for efficient processing

### User Management

- Freelancer and Client roles
- Comprehensive user profiles
- Job proposals tracking
- Customer feedback system
- Notification system

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

## Security Considerations

1. **Environment Variables** - Sensitive data stored in .env (not committed to git)
2. **Rate Limiting** - Prevents brute force attacks
3. **CORS** - Configured for specific origins
4. **JWT Expiration** - Tokens expire after 1 hour
5. **Password Validation** - Requires minimum 8 characters with letters, numbers, and special characters
6. **Helmet** - Sets various HTTP headers for security

## Database Models

### User

- Authentication credentials
- Profile information
- Professional details (for freelancers)
- Job history and proposals
- Ratings and feedback
- Profile images (Cloudinary)

### OTP

- Identifier (email or phone)
- Code and type (SMS/Email)
- Expiration timestamp

### Contact

- Name, email, phone number
- Message content

## Frontend Integration

The backend is designed to work with a React frontend at `http://localhost:5173`. CORS is configured to allow this origin.

## Troubleshooting

### MongoDB Connection Issues

- Verify `MONGO_URI` in .env
- Ensure IP address is whitelisted in MongoDB Atlas

### Cloudinary Upload Fails

- Check API credentials in .env
- Verify folder permissions in Cloudinary

### Email Not Sending

- Enable "Less secure app access" for Gmail (or use app-specific password)
- Check `EMAIL_USER` and `EMAIL_PASS` in .env

### OTP Not Received

- Verify Twilio credentials
- Check phone number format (+country_code format)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

ISC

## Support

For issues or questions, please open an issue in the repository.

---

**Last Updated**: 2024  
**Version**: 1.0.0

chiemek: make it a markup

Workspace: Collecting workspace information# TugaFreela Backend - README

## 📋 Overview

TugaFreela is a freelancer marketplace backend built with **Node.js**, **Express**, and **MongoDB**. It provides authentication, user management, OTP verification, profile management, and contact handling functionalities.

## 🔧 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- Cloudinary account (for image uploads)
- Twilio account (for SMS OTP)
- Gmail account (for email services)

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd tugaFreela-be
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a .env file** in the root directory with the following variables:

   ```env
   # Database
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/tugafreela

   # JWT
   JWT_SECRET=your_jwt_secret_key

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Twilio
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890

   # Email
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password

   # Server
   PORT=5000
   ```

## 📁 Project Structure

```
tugaFreela-be/
├── configs/              # Configuration files
│   ├── cloudinaryConfig.js
│   ├── db.js
│   ├── multer.js
│   └── nodmailer.js
├── controllers/          # Route controllers
│   ├── authController.js
│   ├── contactController.js
│   ├── profileController.js
│   └── userController.js
├── middlewares/          # Express middlewares
│   └── auth.js
├── models/               # Database models
│   ├── contact.js
│   ├── login.js
│   ├── otpModel.js
│   └── user.js
├── routes/               # API routes
│   ├── auth.js
│   ├── contact.js
│   ├── index.js
│   ├── profile.js
│   └── user.js
├── service/              # Business logic services
│   ├── otpConfig.js
│   ├── otpServices.js
│   └── routeOtp.js
├── app.js                # Express app initialization
├── server.js             # Server entry point
└── package.json          # Project dependencies
```

## 🚀 Available Scripts

### Development

```bash
npm run dev
```

Runs the server with Nodemon for automatic restarts on file changes.

### Production

```bash
npm start
```

Runs the server using `node server.js`.

## 🔌 API Endpoints

### Authentication (`/auth`)

- **POST** `/auth/signup` - User registration
- **POST** `/auth/login` - User login
- **POST** `/auth/forgot-password` - Request password reset

### OTP Services

- **POST** `/send-sms-otp` - Send OTP via SMS
- **POST** `/send-email-otp` - Send OTP via email
- **POST** `/verify-otp` - Verify OTP code

### Profile (`/profile`)

- **GET** `/profile` - Get user profile (requires authentication)
- **POST** `/profile/upload-profile-picture` - Upload profile picture (requires authentication)

### Contact (`/contact`)

- **POST** `/contact/contact-us` - Submit contact form

### User (`/user`)

- **GET** `/user/:id` - Get user by ID
- **PUT** `/user/:id` - Update user (requires authentication)
- **DELETE** `/user/:id` - Delete user (requires authentication)

## ✨ Key Features

### 🔐 Authentication & Security

- JWT-based authentication with 1-hour expiration
- Password hashing with bcryptjs (minimum 8 characters with letters, numbers, and special characters)
- Rate limiting (5 requests per 15 minutes)
- Security headers with Helmet
- CORS configuration for frontend integration
- Role-based access control (Freelancer, Client, Admin)

### 📱 OTP Verification

- SMS OTP via Twilio
- Email OTP via Nodemailer
- 15-minute OTP expiration
- Input validation for phone numbers and emails
- Support for international phone formats

### 🖼️ File Management

- Profile picture uploads to Cloudinary
- Multer for file handling with memory storage
- Automatic image optimization and delivery

### 👤 User Management

- Freelancer and Client roles with distinct features
- Comprehensive user profiles with multiple fields
- Job proposals tracking and management
- Customer feedback and ratings system
- Notifications and chat messaging
- Skills and area of interest management

## 🛡️ Security Features

1. **Environment Variables** - Sensitive data stored in .env (not committed to git)
2. **Rate Limiting** - Prevents brute force attacks on OTP and auth endpoints
3. **CORS Protection** - Configured for specific origins only
4. **JWT Tokens** - Expire after 1 hour for better security
5. **Password Validation** - Enforces strong passwords with regex validation
6. **Helmet Middleware** - Sets various HTTP security headers
7. **Input Validation** - Validates phone numbers, emails, and other critical fields
8. **Cloudinary Integration** - Secure image storage with public ID tracking

## 📊 Database Models

### User Schema

```javascript
{
  role, phoneNumber, email, dateOfBirth, address, postalCode, state,
  password, firstName, lastName, nif, citizenCard, title,
  categories[], description, rate,
  resetPasswordToken, resetPasswordExpires,
  profileImageUrl, profileImagePublicId,
  balance, proposals, acceptedProposals, views, level,
  jobProposals[], activeProposals[],
  areaOfInterest[], skills[], projectCompleted, executingProjects,
  projectsInDespute, customerRating, customerFeedback[],
  notifications[], chat[]
}
```

### OTP Schema

```javascript
{
  identifier (email or phone),
  otp (6-digit code),
  type ('sms' or 'email'),
  expiresAt (15-minute expiration),
  timestamps (createdAt, updatedAt)
}
```

### Contact Schema

```javascript
{
  name, email, number, message;
}
```

## 🔌 Frontend Integration

The backend is configured to work with a React frontend. CORS is set to allow requests from:

- `http://localhost:5173` (development)
- `https://your-other-frontend.com` (production)

To modify, update the `corsOptions` in app.js:

```javascript
const corsOptions = {
  origin: ["http://localhost:5173", "https://your-frontend.com"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
```

## ⚙️ Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

Common error codes:

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## 🔧 Configuration Files

### cloudinaryConfig.js

Cloudinary setup for image uploads and management.

### db.js

MongoDB connection configuration.

### multer.js

File upload middleware configuration.

### nodmailer.js

Email service configuration.

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Verify `MONGO_URI` is correct in .env
- Ensure your IP address is whitelisted in MongoDB Atlas
- Check network connectivity

### Cloudinary Upload Fails

- Verify API credentials in .env
- Check folder permissions in Cloudinary dashboard
- Ensure file size is within limits

### Email Not Sending

- Enable "Less secure app access" for Gmail
- Or use app-specific password instead
- Verify `EMAIL_USER` and `EMAIL_PASS` credentials

### OTP Not Received

- Verify Twilio credentials and account balance
- Check phone number format (must include country code: +351...)
- Verify email address is valid

### JWT Token Issues

- Ensure `JWT_SECRET` is set in .env
- Check token format: `Bearer <token>`
- Verify token hasn't expired (1 hour limit)

## 📝 Environment Variables Checklist

- [ ] `MONGO_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - Secret key for JWT signing
- [ ] `CLOUDINARY_CLOUD_NAME` - Cloudinary account name
- [ ] `CLOUDINARY_API_KEY` - Cloudinary API key
- [ ] `CLOUDINARY_API_SECRET` - Cloudinary API secret
- [ ] `TWILIO_ACCOUNT_SID` - Twilio account SID
- [ ] `TWILIO_AUTH_TOKEN` - Twilio auth token
- [ ] `TWILIO_PHONE_NUMBER` - Twilio phone number
- [ ] `EMAIL_SERVICE` - Email service provider (gmail)
- [ ] `EMAIL_USER` - Email account username
- [ ] `EMAIL_PASS` - Email account password/app password
- [ ] `PORT` - Server port (default: 5000)

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## 📄 License

ISC

## 📞 Support

For issues or questions:

1. Check the Troubleshooting section
2. Review error logs in the console
3. Open an issue in the repository

---

**Last Updated**: 2024  
**Version**: 1.0.0  
**Maintainer**: TugaFreela Team
