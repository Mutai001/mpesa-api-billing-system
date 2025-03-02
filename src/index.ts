import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import "dotenv/config"
import { logger } from 'hono/logger'
import { csrf } from 'hono/csrf'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { HTTPException } from 'hono/http-exception'
import { timeout } from 'hono/timeout'
import { cors } from 'hono/cors'

// Import Mpesa Router
import mpesaRouter from './mpesa/mpesa.router.js'

const app = new Hono().basePath('/api')

const customTimeoutException = () => 
  new HTTPException(408, {
    message: "Request timeout after waiting for more than 10 seconds",
  });

// Apply CORS middleware first before other middlewares to ensure it's processed for all requests
// including preflight OPTIONS requests
app.use('*', cors({
  origin: '*',  // In production, you might want to restrict this to your frontend domain
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'X-Content-Type-Options'],
  maxAge: 600,
  credentials: true
}));

// Apply other middlewares
app.use(logger());
app.use(csrf());
app.use(trimTrailingSlash());
app.use('/', timeout(10000, customTimeoutException));

// Make sure CORS preflight requests are handled correctly
app.options('*', (c) => {
  return c.newResponse('', { status: 204 });
});


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