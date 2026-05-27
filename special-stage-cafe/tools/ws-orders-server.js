/*
Simple WebSocket orders server stub.
Install dependencies: npm install ws express
Run: node tools/ws-orders-server.js

This stub accepts WebSocket connections and broadcasts order updates received
from any client to all other connected clients. It also responds to a
`orders:subscribe` message by sending current in-memory orders state.
*/

const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let orders = [];

wss.on('connection', (ws) => {
  console.log('[ws] client connected');

  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg.toString());
      if (data.type === 'orders:subscribe') {
        ws.send(JSON.stringify({ type: 'orders:state', payload: orders }));
      } else if (data.type === 'order:new' && data.payload) {
        orders = [data.payload, ...orders];
        // broadcast
        wss.clients.forEach(c => c.readyState === WebSocket.OPEN && c.send(JSON.stringify({ type: 'order:new', payload: data.payload })));
      } else if (data.type === 'order:updated' && data.payload) {
        orders = orders.map(o => o.id === data.payload.id ? data.payload : o);
        wss.clients.forEach(c => c.readyState === WebSocket.OPEN && c.send(JSON.stringify({ type: 'order:updated', payload: data.payload })));
      }
    } catch (e) { console.error('ws error', e); }
  });

  ws.on('close', () => console.log('[ws] client disconnected'));
});

const port = process.env.PORT || 4003;
server.listen(port, () => console.log(`WS orders server listening on ws://localhost:${port}`));

app.get('/', (req, res) => res.send('WS orders server running'));
