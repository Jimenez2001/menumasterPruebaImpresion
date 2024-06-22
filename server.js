const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const cors = require('cors'); // Importar cors

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    // Usar cors como middleware
    const corsMiddleware = cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type'],
    });

    // Aplicar el middleware cors a todas las solicitudes
    corsMiddleware(req, res, () => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    });
  }).listen(3000, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log('> Ready on http://0.0.0.0:3000');
  });
});
