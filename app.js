//-------------------------------------
//IMPORTS
//-------------------------------------
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoute.js';
import careerRoute from './routes/careerRoute.js'
import chatRoute from './routes/chatRoute.js';
import historyRoute from './routes/historyRoute.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
//--------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerSpec = YAML.load(path.join(__dirname, 'swagger.yaml'));

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//--------------------------------
// ROUTES
//--------------------------------
app.use('/api/users', userRoutes);
app.use('/api/career', careerRoute); // Route for career advice
app.use('/api/chat', chatRoute); // Route for chatbot
app.use('/api/history', historyRoute); // Route for history tracking

app.get('/', (req, res) => {
    res.send('Welcome, Career Coach at your service!'); // Test route
});
//--------------------------------


//-----------------------------
// SWAGGER SETUP
//-----------------------------

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//--------------------------------

//--------------------------------  
// ERROR HANDLING
//--------------------------------
// Error handling middleware
app.use(notFound);
app.use(errorHandler);
//--------------------------------


//--------------------------------  
// START SERVER
//-------------------------------- 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//--------------------------------
