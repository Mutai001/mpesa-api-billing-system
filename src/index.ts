import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import "dotenv/config"
import { logger } from 'hono/logger'
import { csrf } from 'hono/csrf'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { HTTPException } from 'hono/http-exception'
import { timeout } from 'hono/timeout'
import { cors } from 'hono/cors'  // ✅ Import CORS middleware

// Import Mpesa Router
import mpesaRouter from './mpesa/mpesa.router.js'

const app = new Hono().basePath('/api')

const customTimeoutException = () =>
  new HTTPException(408, {
    message: "Request timeout after waiting for more than 10 seconds",
  });

// ✅ Apply Middlewares
app.use(logger());
app.use(csrf());
app.use(trimTrailingSlash());
app.use(cors({  // ✅ Enable CORS for all origins
  origin: '*', 
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
}));
app.use('/', timeout(10000, customTimeoutException));

// Health Check
app.get('/ok', (c) => c.text('The server is running ☑️'));
app.get('/timeout', async (c) => {
    await new Promise((resolve) => setTimeout(resolve, 11000));
    return c.text("data after 5 seconds", 200);
});

// Routes
app.route('/mpesa', mpesaRouter);

// Default route
app.get('/', (c) => c.json({ message: 'Welcome to the API', routes: app.routes }));

const port = Number(process.env.PORT) || 8000;
console.log(`Server is running on port ${port}`);
console.log('Registered routes: ', app.routes);

serve({
    fetch: app.fetch,
    port: port,
});
