# VirtualSMS API Examples

Code examples for integrating with the [VirtualSMS](https://virtualsms.io) SMS verification API.

## Quick Start

### cURL

```bash
# List available services
curl https://virtualsms.io/api/v1/services

# Get available countries for WhatsApp
curl https://virtualsms.io/api/v1/services/whatsapp/countries

# Purchase activation
curl -X POST https://virtualsms.io/api/v1/activations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"service": "whatsapp", "country": "GB"}'

# Check for SMS
curl https://virtualsms.io/api/v1/activations/{id}/sms \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Python

```python
import requests

API_KEY = "your_api_key"
BASE = "https://virtualsms.io/api/v1"
headers = {"Authorization": f"Bearer {API_KEY}"}

# Get services
services = requests.get(f"{BASE}/services").json()

# Buy a number
activation = requests.post(f"{BASE}/activations", 
    headers=headers,
    json={"service": "whatsapp", "country": "GB"}
).json()

print(f"Number: {activation['number']}")

# Poll for SMS
import time
for _ in range(30):
    sms = requests.get(f"{BASE}/activations/{activation['id']}/sms", headers=headers).json()
    if sms.get("code"):
        print(f"Code: {sms['code']}")
        break
    time.sleep(5)
```

### Node.js

```javascript
const API_KEY = 'your_api_key';
const BASE = 'https://virtualsms.io/api/v1';

// Get services
const services = await fetch(`${BASE}/services`).then(r => r.json());

// Buy a number
const activation = await fetch(`${BASE}/activations`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ service: 'whatsapp', country: 'GB' })
}).then(r => r.json());

console.log(`Number: ${activation.number}`);
```

## API Documentation

Full API docs at [virtualsms.io/api](https://virtualsms.io/api)

## Support

- 🌐 [virtualsms.io](https://virtualsms.io)
- 📧 support@virtualsms.io

## License

MIT
