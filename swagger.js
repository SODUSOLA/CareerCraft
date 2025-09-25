// swagger.js
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'CareerCraft API',
        version: '1.0.0',
        description: 'API documentation for the Carreer Craft app which allows users crafting smart career decisions using AI-powered insights.',
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Local development server',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            User: {
                type: 'object',
                required: ['username', 'password', 'email'],
                properties: {
                    id: {
                        type: 'string',
                        description: 'User ID',
                        example: '64a1e3f9885cd2b9f66c5678',
                    },
                    username: {
                        type: 'string',
                        description: 'Username of the user',
                        example: 'John Doe',
                    },
                    email: {
                        type: 'string',
                        description: 'Email address of the user',
                        example: 'johndoe@example.com',
                    },
                    password: {
                        type: 'string',
                        description: 'Password of the user',
                        example: 'password123',
                    },
                },
            },
        },
    },
    security: [{ bearerAuth: [] }],
};

const options = {
    swaggerDefinition,
    apis: ['./Routes/*.js'], // Path to your route files
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
