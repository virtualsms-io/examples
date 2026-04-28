# VirtualSMS API Examples

Code examples for integrating with the [VirtualSMS](https://virtualsms.io) SMS verification API.

These examples target the modern `/api/v1/customer/*` endpoints and use the canonical `X-API-Key` header. For the sms-activate-compatible legacy API, see [github.com/virtualsms-io/api-docs](https://github.com/virtualsms-io/api-docs).

## Quick Start

### cURL

```bash
# List available services (requires X-API-Key)
curl -H "X-API-Key: vms_your_key" \
  https://virtualsms.io/api/v1/customer/services

# Get available countries for a service
curl -H "X-API-Key: vms_your_key" \
  "https://virtualsms.io/api/v1/customer/countries?service=wa"

# Buy a number
curl -X POST https://virtualsms.io/api/v1/customer/purchase \
  -H "X-API-Key: vms_your_key" \
  -H "Content-Type: application/json" \
  -d '{"service": "wa", "country": "GB"}'

# Check order status (poll every 3-5s, or use WebSocket)
curl -H "X-API-Key: vms_your_key" \
  https://virtualsms.io/api/v1/customer/order/ORDER_ID

# Cancel a pending order (after 2-minute hold)
curl -X POST -H "X-API-Key: vms_your_key" \
  https://virtualsms.io/api/v1/customer/cancel/ORDER_ID
```

### Python

```python
import requests
import time

API_KEY = "vms_your_api_key"
BASE = "https://virtualsms.io/api/v1"
headers = {"X-API-Key": API_KEY}

# Buy a number for WhatsApp in the UK
order = requests.post(
    f"{BASE}/customer/purchase",
    headers=headers,
    json={"service": "wa", "country": "GB"},
).json()
print(f"Number: {order['phone_number']} (order {order['order_id']}, ${order['price']})")

# Poll for SMS
for _ in range(60):
    res = requests.get(f"{BASE}/customer/order/{order['order_id']}", headers=headers).json()
    if res.get("messages"):
        msg = res["messages"][0]
        print(f"Code received from {msg['sender']}: {msg['content']}")
        break
    time.sleep(5)
```

### Node.js

```javascript
const API_KEY = 'vms_your_api_key';
const BASE = 'https://virtualsms.io/api/v1';
const headers = { 'X-API-Key': API_KEY };

// Buy a number
const buy = await fetch(`${BASE}/customer/purchase`, {
  method: 'POST',
  headers: { ...headers, 'Content-Type': 'application/json' },
  body: JSON.stringify({ service: 'wa', country: 'GB' }),
});
const order = await buy.json();
console.log(`Number: ${order.phone_number} ($${order.price})`);

// Poll for SMS
for (let i = 0; i < 60; i++) {
  const res = await fetch(`${BASE}/customer/order/${order.order_id}`, { headers });
  const data = await res.json();
  if (data.messages?.length) {
    console.log(`Code: ${data.messages[0].content}`);
    break;
  }
  await new Promise(r => setTimeout(r, 5000));
}
```

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/price?service=&country=` | Public price lookup (no auth) |
| `GET` | `/api/v1/customer/services` | All services |
| `GET` | `/api/v1/customer/countries` | All countries (or filtered by `?service=`) |
| `GET` | `/api/v1/customer/balance` | Account balance |
| `POST` | `/api/v1/customer/purchase` | Buy a number (`{service, country}`) |
| `GET` | `/api/v1/customer/order/{id}` | Order status + received SMS |
| `POST` | `/api/v1/customer/swap/{id}` | Replacement number (after 2-min hold) |
| `POST` | `/api/v1/customer/cancel/{id}` | Cancel + refund (after 2-min hold) |

## Real-time delivery

Skip polling — connect to the WebSocket for instant SMS:

```
wss://virtualsms.io/ws/orders
```

Authenticate with `?api_key=` query param. Receive `order_status` events with the SMS payload as soon as it arrives.

## SDKs

- **MCP server (AI agents):** [github.com/virtualsms-io/mcp-server](https://github.com/virtualsms-io/mcp-server)
- **PHP SDK:** [github.com/virtualsms-io/virtualsms-php-sdk](https://github.com/virtualsms-io/virtualsms-php-sdk)

## API Documentation

Full reference at [virtualsms.io/docs](https://virtualsms.io/docs)

## Support

- [virtualsms.io](https://virtualsms.io)
- support@virtualsms.io

## Changelog

**2026-04-29** — Examples updated to use the canonical `/customer/*` endpoints + `X-API-Key` header. Earlier examples used `Authorization: Bearer` and paths (`/activations`) that don't match the canonical mcp-server client.

## License

MIT
