import { Hono } from 'hono';
import routes from './routes/index.js';
import { cors } from 'hono/cors';

const app = new Hono();

app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.get('/', (c) => c.text('OK'));
app.get('/ping', (c) => c.text('pong'));

app.route('/', routes);

// Error handling
app.notFound((c) =>
  c.json(
    { error: 'Not Found', details: 'The requested resource was not found' },
    404,
  ),
);
app.onError((err, c) =>
  c.json({ error: 'Internal Server Error', details: err.message }, 500),
);

export default app;