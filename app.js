import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoute.js';
import careerRoute from './routes/careerRoute.js'
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';

// Load environment variables
dotenv.config();

// Create an Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/career', careerRoute);

// Test route
app.get('/', (req, res) => {
    res.send('Welcome, Career Coach at your service!');
});

// swagger setup

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});