# CareerCraft
Crafting smarter career decisions with AI-powered insights.

## Features
- **AI-Powered Career Counseling**: Receive personalized pros/cons, career overviews, and potential paths.
- **Data-Backed Insights**: Explore salary trends, job demand, and skill relevance.
- **Interactive Chat Interface**: Engage in AI-driven career conversations.
- **History Tracking**: Save queries and responses for future reference.
- **User Authentication**: Secure account creation and login with JWT tokens.

## Tech Stack
- **Backend**: Node.js (Express), PostgreSQL (Prisma), Gemini API
- **Authentication**: JWT, bcryptjs (password hashing)
- **Deployment**: Docker, Render
- **Database**: PostgreSQL with Prisma ORM

---

## API Endpoints

#### User Routes

##### **POST** `/api/users/register` – _Register a new user_
```json
{
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "password123"
}
```

##### **POST** `/api/users/login` – _Login user_
```json
{
    "email": "testuser@example.com",
    "password": "password123"
}
```

##### **GET** `/api/users/me` – _Get current user profile (requires JWT token)_

_**HEADER**_
```json
{
    "Authorization" = "Bearer <token>"
}
```

##### **PUT** `/api/users/me` – _Update user profile (requires JWT token)_

_**Input any detail you want to update**_
```json
{
    "email": "new_email@example.com"
}
```