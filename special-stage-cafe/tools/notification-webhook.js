const http = require('http');
const port = process.env.PORT || 4002;

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const json = JSON.parse(body);
        console.log('[notification-webhook] received:', JSON.stringify(json, null, 2));
      } catch (e) {
        console.log('[notification-webhook] received non-json payload');
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    });
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Notification webhook stub running');
});

server.listen(port, () => console.log(`Notification webhook stub listening on http://localhost:${port}`));
