const express = require('express');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Add more detailed startup logging
console.log('Starting server...');
console.log('Environment variables:');
console.log('- PORT:', process.env.PORT);
console.log('- API_KEY:', process.env.API_KEY);
console.log('- MONGODB_URI:', process.env.MONGODB_URI);

// Make sure body parsing middleware is set up correctly
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
        body: req.body,
        query: req.query,
        headers: req.headers
    });
    next();
});

const verifyApiKey = (req, res, next) => {
    console.log('Received request with body:', req.body);
    const apiKey = req.body.key || req.headers['x-api-key'] || req.query.apiKey;
    console.log('Received API key:', apiKey);

    const validApiKey = process.env.API_KEY;
    console.log('Valid API key:', validApiKey);

    if (!apiKey || apiKey !== validApiKey) {
        return res.status(401).json({ error: 'Invalid API key' });
    }

    next();
};
app.post('/api', verifyApiKey, async (req, res) => {
    try {
        console.log('Request body:', req.body); // Debug log
        const moduleName = req.body.module.replace('Controller', '').toLowerCase();
        const method = req.body.method;
        
        console.log('Module:', moduleName); // Debug log
        console.log('Method:', method); // Debug log

        if (!moduleName || !method) {
            return res.status(400).json({ error: 'Module and method are required' });
        }

        try {
            const controller = require(`./controllers/${moduleName}Controller`);
            console.log('Controller loaded:', controller); // Debug log

            if (typeof controller[method] !== 'function') {
                return res.status(404).json({ error: 'Method not found in controller' });
            }

            const result = await controller[method](req, res);
            return result;

        } catch (error) {
            console.error('Controller error:', error); // Debug log
            if (error.code === 'MODULE_NOT_FOUND') {
                return res.status(404).json({ error: 'Controller not found' });
            }
            throw error;
        }

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/test', (req, res) => {
    console.log('POST test body:', req.body);
    res.json({ 
        message: 'POST test successful!',
        receivedBody: req.body 
    });
});

app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
});

app.use((req, res) => {
    res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});

// Add this line after the environment variables logging
connectDB();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    // console.log('Available routes:');
    // console.log('- GET /test');
    // console.log('- POST /test');
    // console.log('- POST /api');
}); 