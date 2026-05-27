Notification webhook stub
=========================

This project includes a small webhook stub to receive notification POSTs for local testing.

Run the stub:

```bash
npm run notification-stub
```

The stub listens on `http://localhost:4002` by default and logs incoming JSON payloads.

How to test from the app:

- Start the webhook stub locally.
- Tell the app to use the webhook URL by running in developer console or application code:

```js
localStorage.setItem('ssc_notifications_webhook', 'http://localhost:4002/notify');
```


- Trigger a notification in the app (e.g., place an order, or trigger `NotificationService.push()` that includes an `email`).
- The stub will print the received notification JSON to the terminal where `notification-stub` is running.

Notes:
- This stub is intentionally minimal and designed for local development only. It does not send real emails.
- For real email delivery, wire the `NotificationService.sendExternal()` to an API that sends email (SendGrid, Postmark, or your SMTP backend).
