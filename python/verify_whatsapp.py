"""
VirtualSMS - WhatsApp Verification Example
https://virtualsms.io
"""
import requests
import time

API_KEY = "your_api_key_here"
BASE_URL = "https://virtualsms.io/api/v1"

def verify_whatsapp(country="GB"):
    headers = {"Authorization": f"Bearer {API_KEY}"}
    
    # Step 1: Purchase activation
    resp = requests.post(f"{BASE_URL}/activations", 
        headers=headers,
        json={"service": "whatsapp", "country": country}
    )
    activation = resp.json()
    print(f"📱 Number: {activation['number']}")
    print(f"💰 Price: ${activation['price']}")
    
    # Step 2: Use this number in WhatsApp signup
    print("\n⏳ Waiting for SMS code...")
    
    # Step 3: Poll for SMS
    for i in range(60):
        sms = requests.get(
            f"{BASE_URL}/activations/{activation['id']}/sms", 
            headers=headers
        ).json()
        
        if sms.get("code"):
            print(f"✅ Code received: {sms['code']}")
            return sms["code"]
        
        time.sleep(5)
    
    print("❌ Timeout - no SMS received")
    return None

if __name__ == "__main__":
    verify_whatsapp()
