# CareerCraft
Crafting smarter career decisions with AI-powered insights.

CareerCraft is an innovative web application designed to help users navigate their career paths using advanced AI technology. Powered by Google's Gemini AI, it provides personalized career advice, interactive chat sessions, and data-driven insights to empower users in making informed career choices.

## Features
- **AI-Powered Career Counseling**: Leveraging CareerCraft Query 2.0, receive structured and personalized career advice, including pros/cons, career overviews, and potential paths. The system now separates query answering and contextual chat for more focused and relevant responses.
- **Data-Backed Insights**: Explore salary trends, job demand, and skill relevance.
- **Interactive Chat Interface**: Engage in AI-driven career conversations with session management.
- **History Tracking**: Save queries and responses for future reference.
- **User Authentication**: Secure account creation, login, password reset, and profile management with JWT tokens, including welcome email on registration and password strength requirements.
- **Comprehensive API**: RESTful API with Swagger documentation for easy integration.

## Tech Stack
- **Backend**: Node.js (Express), PostgreSQL (Prisma), Gemini API, Redis
- **Authentication**: JWT, bcryptjs (password hashing), nodemailer (email services)
- **Validation**: Zod for input validation
- **Error Handling**: Custom middleware for consistent JSON error responses
- **Deployment**: Docker, Render
- **Database**: PostgreSQL with Prisma ORM

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/careercraft.git
   cd careercraft
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with the following:
   ```
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   EMAIL_USER=your_gmail_address
   EMAIL_PASS=your_gmail_app_password
   REDIS_URL=your_redis_connection_string
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the server:
   ```bash
   npm start
   ```

The server will run on `http://localhost:3000`.

## Usage

### User Registration and Authentication
- Register a new account with username, email, and password.
- Login to receive a JWT token for authenticated requests.
- Forgot password: Request a reset code via email, then reset password.
- Change password: Update password while logged in.

**Password Reset Flow**
1.  Request reset code:
    ```bash
    curl -X POST http://localhost:3000/api/users/forgot-password \\
      -H "Content-Type: application/json" \\
      -d '{"email": "john@example.com"}'
    ```
2.  Reset password with code:
    ```bash
    curl -X POST http://localhost:3000/api/users/reset-password \\
      -H "Content-Type: application/json" \\
      -d '{
        "email": "john@example.com",
        "code": "123456",
        "newPassword": "NewSecurePass123!",
        "confirmPassword": "NewSecurePass123!"
      }'
    ```

**Authenticated Requests**
Include JWT token in Authorization header:
```bash
curl -X GET http://localhost:3000/api/users/me \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Career Advice
- Send queries to `/api/career/query` to get AI-generated career advice leveraging CareerCraft Query 2.0.
- Queries can be anonymous or linked to a user account.

### Chat Sessions
- Start interactive chat sessions via `/api/chat/{sessionId}`.
- Sessions expire after 10 minutes of inactivity.

### API Documentation
Access Swagger UI at `http://localhost:3000/api-docs` for full API documentation.

## Database Schema

CareerCraft uses PostgreSQL with Prisma ORM. The database consists of the following models:

### User
- `id`: Unique identifier (UUID)
- `username`: Unique username
- `email`: Unique email address
- `password`: Hashed password
- `resetToken`: Optional token for password reset
- `resetTokenExpiry`: Optional expiry date for reset token
- `createdAt`: Account creation timestamp

### CareerLog
- `id`: Unique identifier (UUID)
- `userId`: Optional user association
- `query`: User's career query
- `response`: AI-generated response (JSON)
- `createdAt`: Query timestamp

### ChatSession
- `id`: Unique identifier (UUID)
- `userId`: Optional user association
- `isActive`: Session status
- `lastActivity`: Last activity timestamp
- `messages`: Related chat messages

### ChatMessage
- `id`: Unique identifier (UUID)
- `sessionId`: Associated session ID
- `userMessage`: User's message
- `botResponse`: AI response
- `createdAt`: Message timestamp

## API Endpoints

### User Routes

#### **POST** `/api/users/register` – Register a new user
```json
{
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "password123",
    "confirmPassword": "password123"
}
```

#### **POST** `/api/users/login` – Login user
```json
{
    "email": "testuser@example.com",
    "password": "password123"
}
```

#### **POST** `/api/users/forgot-password` – Request password reset
```json
{
    "email": "testuser@example.com"
}
```

#### **POST** `/api/users/reset-password` – Reset password with code
```json
{
    "email": "testuser@example.com",
    "code": "123456",
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
}
```

#### **PUT** `/api/users/change-password` – Change password (authenticated)
```json
{
    "oldPassword": "oldpassword123",
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
}
```

#### **GET** `/api/users/me` – Get current user profile (requires JWT token)
**Header:**
```json
{
    "Authorization": "Bearer <token>"
}
```

#### **PUT** `/api/users/me` – Update user profile (requires JWT token)
```json
{
    "username": "newusername",
    "email": "newemail@example.com"
}
```

### Career Routes

#### **POST** `/api/career/query` – Get career advice (requires JWT token)
```json
{
    "query": "What are the pros and cons of becoming a software engineer?"
}
```

### Chat Routes

#### **POST** `/api/chat` – Start new chat (requires JWT token)
```json
{
    "message": "Tell me more about data science careers"
}
```

#### **POST** `/api/chat/{sessionId}` – Continue chat (requires JWT token)
```json
{
    "message": "Which is the highest paying?"
}
```

### History Routes

#### **GET** `/api/history/career` – Get user's career query history (requires JWT token)
**Header:**
```json
{
    "Authorization": "Bearer <token>"
}
```

#### **DELETE** `/api/history/career/{id}` – Delete a specific career history entry (requires JWT token)
**Header:**
```json
{
    "Authorization": "Bearer <token>"
}
```

#### **GET** `/api/history/chat` – Get user's chat history (requires JWT token)
**Header:**
```json
{
    "Authorization": "Bearer <token>"
}
```

#### **DELETE** `/api/history/chat/{id}` – Delete a specific chat history entry (requires JWT token)
**Header:**
```json
{
    "Authorization": "Bearer <token>"
}
```

#### **GET** `/api/history/all` – Get all user's history (career + chat) (requires JWT token)
**Header:**
```json
{
    "Authorization": "Bearer <token>"
}
```

## Roadmap
CareerCraft is currently in active development. The backend foundation is nearly complete, with ongoing efforts to refine the AI logic layer. The next phase involves building a frontend web client to connect to the backend APIs. Future enhancements include data-driven insights, UX improvements, and deployment to production.

## Contributing
1. Fork the repository.
2. Create a feature branch.
3. Make your changes and test thoroughly.
4. Submit a pull request.

## License
MIT License - see LICENSE file for details.
