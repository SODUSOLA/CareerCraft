# CareerCraft Features and Usage Guide

## Overview
CareerCraft is a comprehensive career guidance platform that leverages AI to provide personalized career advice, interactive conversations, and data-driven insights. This document outlines the key features and how to use them effectively.

## Core Features

### 1. User Authentication System
CareerCraft provides a robust authentication system with multiple security features.

#### Registration
- **Endpoint**: `POST /api/users/register`
- **Requirements**: Username, email, password, and password confirmation
- **Features**:
  - Input validation using Zod schemas
  - Password strength requirements
  - Duplicate email/username prevention
  - Automatic welcome email upon successful registration

#### Login
- **Endpoint**: `POST /api/users/login`
- **Requirements**: Email and password
- **Returns**: JWT token for authenticated requests

#### Password Management
- **Forgot Password**: `POST /api/users/forgot-password`
  - Send reset code to registered email
- **Reset Password**: `POST /api/users/reset-password`
  - Verify code and set new password
- **Change Password**: `PUT /api/users/change-password`
  - Update password while authenticated (requires old password)

#### Profile Management
- **View Profile**: `GET /api/users/me` (requires authentication)
- **Update Profile**: `PUT /api/users/me` (requires authentication)
  - Update username, email, or password

### 2. AI-Powered Career Counseling
Get personalized career advice powered by Google's Gemini AI.

#### Career Query
- **Endpoint**: `POST /api/career/query`
- **Features**:
  - Structured responses with career overviews, pros/cons, and potential roles
  - Optional user association for history tracking
  - Response logging for future reference

#### Interactive Chat
- **Endpoint**: `POST /api/chat/{sessionId}`
- **Features**:
  - Session-based conversations
  - 10-minute inactivity timeout
  - Message history preservation
  - AI-driven responses tailored to career topics

### 3. Data Persistence
CareerCraft uses PostgreSQL with Prisma ORM for robust data storage and management.

#### Database Models
- **User**: Stores user accounts with authentication details, including password reset tokens
- **CareerLog**: Records career queries and AI responses, optionally linked to users
- **ChatSession**: Manages chat sessions with activity tracking and 10-minute inactivity timeout
- **ChatMessage**: Stores individual messages within chat sessions for conversation history

#### Features
- **Secure User Accounts**: Hashed passwords with bcryptjs, JWT authentication
- **Career Query Logging**: All AI-generated career advice saved for future reference
- **Chat History**: Complete conversation logs with session management
- **Data Integrity**: Relational database design ensuring data consistency

### 4. API Documentation
- **Swagger UI**: Interactive API documentation at `/api-docs`
- **OpenAPI Specification**: Complete YAML documentation in `swagger.yaml`
- **Comprehensive Coverage**: All endpoints documented with examples

### Using the API

#### Example: User Registration
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!"
  }'
```

#### Example: Login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

#### Example: Get Career Advice (requires JWT token)
```bash
curl -X POST http://localhost:3000/api/career/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "What are the pros and cons of becoming a data scientist?"
  }'
```

#### Example: Start Chat Session (requires JWT token)
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "message": "Can you tell me about software engineering career paths?"
  }'
```

### Advanced Usage

#### Password Reset Flow
1. Request reset code:
   ```bash
   curl -X POST http://localhost:3000/api/users/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email": "john@example.com"}'
   ```

2. Reset password with code:
   ```bash
   curl -X POST http://localhost:3000/api/users/reset-password \
     -H "Content-Type: application/json" \
     -d '{
       "email": "john@example.com",
       "resetCode": "123456",
       "newPassword": "NewSecurePass123!",
       "confirmPassword": "NewSecurePass123!"
     }'
   ```

#### Authenticated Requests
Include JWT token in Authorization header:
```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Security Features

- **Input Validation**: All inputs validated using Zod schemas
- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Stateless authentication with configurable expiry
- **Error Handling**: Consistent JSON error responses
- **Email Verification**: Secure password reset via email codes


### Future Enhancements

- Frontend web application
- Mobile app support
- Advanced analytics dashboard
- Integration with job boards
- Multi-language support
- Premium features for enhanced AI responses

For more details, refer to the API documentation at `/api-docs` or the main README.md file.
