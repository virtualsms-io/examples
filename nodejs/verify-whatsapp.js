/**
 * VirtualSMS - WhatsApp Verification Example
 * https://virtualsms.io
 */

const API_KEY = 'your_api_key_here';
const BASE_URL = 'https://virtualsms.io/api/v1';

async function verifyWhatsApp(country = 'GB') {
  // Step 1: Purchase activation
  const activation = await fetch(`${BASE_URL}/activations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ service: 'whatsapp', country })
  }).then(r => r.json());

  console.log(`📱 Number: ${activation.number}`);
  console.log(`💰 Price: $${activation.price}`);
  console.log('\n⏳ Waiting for SMS code...');

  // Step 2: Poll for SMS
  for (let i = 0; i < 60; i++) {
    const sms = await fetch(
      `${BASE_URL}/activations/${activation.id}/sms`,
      { headers: { 'Authorization': `Bearer ${API_KEY}` } }
    ).then(r => r.json());

    if (sms.code) {
      console.log(`✅ Code received: ${sms.code}`);
      return sms.code;
    }

    await new Promise(r => setTimeout(r, 5000));
  }

  console.log('❌ Timeout - no SMS received');
  return null;
}

verifyWhatsApp();
