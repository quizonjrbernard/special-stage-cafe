Server-side authorization example

This file shows a minimal Express middleware example that enforces an Authorization
header and verifies a static token. Replace with your real auth logic (JWT, sessions, etc).

Example (Node/Express):

```js
function requireAuth(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.slice(7);
  // in real app verify token properly (JWT verification)
  if (token !== process.env.ADMIN_TOKEN) return res.status(403).json({ error: 'Forbidden' });
  // token valid
  next();
}

app.post('/api/orders/:id/complete', requireAuth, (req, res) => {
  // lookup order, update status, notify customer, etc.
  res.json({ ok: true });
});
```

Notes:
- Use HTTPS in production.
- Prefer JWT with proper signing and short TTL, or session-based auth.
- Protect WebSocket endpoints by checking an initial token as a query param or via a handshake header.
