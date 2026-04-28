/**
 * VirtualSMS - WhatsApp Verification Example
 * https://virtualsms.io
 *
 * Uses the canonical /api/v1/customer/* endpoints with X-API-Key auth.
 */

const API_KEY = process.env.VIRTUALSMS_API_KEY || 'vms_your_api_key_here';
const BASE_URL = 'https://virtualsms.io/api/v1';

async function verifyWhatsApp(country = 'GB') {
  const headers = { 'X-API-Key': API_KEY };

  // Step 1: Buy a number
  const buyRes = await fetch(`${BASE_URL}/customer/purchase`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ service: 'wa', country }),
  });
  if (!buyRes.ok) {
    console.error(`Purchase failed: ${buyRes.status} ${await buyRes.text()}`);
    return null;
  }
  const order = await buyRes.json();
  console.log(`Number: ${order.phone_number}`);
  console.log(`Price:  $${order.price}`);
  console.log(`Order:  ${order.order_id}`);
  console.log('\nUse the number in the WhatsApp signup flow, then wait...\n');

  // Step 2: Poll for SMS
  // Tip: for production, connect to wss://virtualsms.io/ws/orders for instant delivery.
  for (let i = 0; i < 60; i++) {
    const res = await fetch(`${BASE_URL}/customer/order/${order.order_id}`, { headers });
    const data = await res.json();

    if (data.messages && data.messages.length > 0) {
      const msg = data.messages[0];
      console.log(`SMS from ${msg.sender}: ${msg.content}`);
      return msg.content;
    }

    if (['cancelled', 'expired'].includes(data.status)) {
      console.log(`Order ended with status: ${data.status}`);
      return null;
    }

    await new Promise(r => setTimeout(r, 5000));
  }

  console.log('Timeout - no SMS received in 5 minutes.');
  // Optional: cancel for refund (only allowed after the 2-minute hold)
  await fetch(`${BASE_URL}/customer/cancel/${order.order_id}`, {
    method: 'POST',
    headers,
  });
  return null;
}

verifyWhatsApp();
