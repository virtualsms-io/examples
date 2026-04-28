"""
VirtualSMS - WhatsApp Verification Example
https://virtualsms.io

Uses the canonical /api/v1/customer/* endpoints with X-API-Key auth.
"""
import os
import requests
import time

API_KEY = os.environ.get("VIRTUALSMS_API_KEY", "vms_your_api_key_here")
BASE_URL = "https://virtualsms.io/api/v1"


def verify_whatsapp(country: str = "GB") -> str | None:
    headers = {"X-API-Key": API_KEY}

    # Step 1: Buy a number
    resp = requests.post(
        f"{BASE_URL}/customer/purchase",
        headers=headers,
        json={"service": "wa", "country": country},
    )
    resp.raise_for_status()
    order = resp.json()
    order_id = order["order_id"]
    print(f"Number: {order['phone_number']}")
    print(f"Price:  ${order['price']}")
    print(f"Order:  {order_id}")
    print()
    print("Use the number in the WhatsApp signup flow, then wait...")
    print()

    # Step 2: Poll for SMS (every 5s, up to 5 minutes)
    # Tip: for production, connect to wss://virtualsms.io/ws/orders for instant delivery.
    for _ in range(60):
        status = requests.get(
            f"{BASE_URL}/customer/order/{order_id}",
            headers=headers,
        ).json()

        if status.get("messages"):
            msg = status["messages"][0]
            print(f"SMS from {msg['sender']}: {msg['content']}")
            return msg["content"]

        if status.get("status") in ("cancelled", "expired"):
            print(f"Order ended with status: {status['status']}")
            return None

        time.sleep(5)

    print("Timeout - no SMS received in 5 minutes.")
    # Optional: cancel for refund (only allowed after the 2-minute hold)
    requests.post(f"{BASE_URL}/customer/cancel/{order_id}", headers=headers)
    return None


if __name__ == "__main__":
    verify_whatsapp()
