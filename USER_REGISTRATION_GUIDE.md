# User Registration Testing Guide

## Overview
This guide walks through testing the complete user registration flow in DensityX-AI.

---

## Registration Flow

```
1. User has valid ticket ID (from CSV)
           ↓
2. Send POST /user/register with JSON
           ↓
3. Backend validates ticket against tickets.csv
           ↓
4. If valid: Create user record
   If invalid: Return error 400
           ↓
5. User registered, can update location
```

---

## Step 1: Get a Valid Ticket ID

### Valid Tickets (from backend/tickets.csv)
```
DX-005491 ✅
DX-010437 ✅
DX-019018 ✅
DX-028903 ✅
DX-059948 ✅
DX-063515 ✅
DX-066162 ✅
DX-071434 ✅
DX-107915 ✅
DX-095667 ✅
```

And 92 more (102 total in CSV)

---

## Step 2: Register User with cURL

### Option A: Use cURL (Recommended for Testing)

```bash
curl -X POST https://densityx-ai.onrender.com/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "DX-005491",
    "name": "John Doe",
    "phone": "9876543210"
  }'
```

### Response (201 Created)
```json
{
  "status": "registered",
  "ticket_id": "DX-005491",
  "message": "User John Doe registered. Please enable GPS."
}
```

---

## Step 3: Update User Location (After Registration)

Once registered, send location updates:

```bash
curl -X POST https://densityx-ai.onrender.com/user/location \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "DX-005491",
    "latitude": 13.0851,
    "longitude": 80.2101,
    "gps_enabled": true
  }'
```

### Response (200 OK)
```json
{
  "status": "updated",
  "ticket_id": "DX-005491",
  "message": "Location updated: 13.0851, 80.2101",
  "gps_enabled": true
}
```

---

## Complete Test Sequence

Run these commands in order to test the full flow:

```bash
# 1. Check backend is healthy
curl https://densityx-ai.onrender.com/health

# 2. Register a user
curl -X POST https://densityx-ai.onrender.com/user/register \
  -H "Content-Type: application/json" \
  -d '{"ticket_id":"DX-005491","name":"Test User","phone":"1234567890"}'

# 3. Update their location
curl -X POST https://densityx-ai.onrender.com/user/location \
  -H "Content-Type: application/json" \
  -d '{"ticket_id":"DX-005491","latitude":13.0851,"longitude":80.2101,"gps_enabled":true}'

# 4. Get the user profile
curl "https://densityx-ai.onrender.com/user/me?ticket_id=DX-005491"

# 5. Check crowd data (should see the user as a point)
curl https://densityx-ai.onrender.com/crowd/locations
```

---

## Error Cases

### ❌ Error 1: Invalid Ticket
```bash
curl -X POST https://densityx-ai.onrender.com/user/register \
  -H "Content-Type: application/json" \
  -d '{"ticket_id":"INVALID-123","name":"Test","phone":"1234567890"}'
```

Response (400 Bad Request):
```json
{"detail":"Invalid ticket ID: INVALID-123"}
```

**Solution**: Use a valid ticket from tickets.csv

---

### ❌ Error 2: Wrong HTTP Method (GET instead of POST)
```bash
curl https://densityx-ai.onrender.com/user/register
```

Response (405 Method Not Allowed):
```json
{"detail":"Method Not Allowed"}
```

**Solution**: Always use `-X POST` for registration

---

### ❌ Error 3: Missing Required Fields
```bash
curl -X POST https://densityx-ai.onrender.com/user/register \
  -H "Content-Type: application/json" \
  -d '{"ticket_id":"DX-005491"}'
```

Response (422 Unprocessable Entity):
```json
{"detail":"...validation error..."}
```

**Solution**: Include all required fields:
- `ticket_id` (string)
- `name` (string)
- `phone` (string)

---

### ❌ Error 4: Missing Content-Type Header
```bash
curl -X POST https://densityx-ai.onrender.com/user/register \
  -d '{"ticket_id":"DX-005491","name":"Test","phone":"1234567890"}'
```

**Solution**: Add header:
```bash
-H "Content-Type: application/json"
```

---

## Testing in Python

```python
import requests
import json

BASE_URL = "https://densityx-ai.onrender.com"

# Register user
response = requests.post(
    f"{BASE_URL}/user/register",
    headers={"Content-Type": "application/json"},
    json={
        "ticket_id": "DX-005491",
        "name": "Test User",
        "phone": "9876543210"
    }
)

print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")

# Update location
if response.status_code == 201:
    location_response = requests.post(
        f"{BASE_URL}/user/location",
        headers={"Content-Type": "application/json"},
        json={
            "ticket_id": "DX-005491",
            "latitude": 13.0851,
            "longitude": 80.2101,
            "gps_enabled": True
        }
    )
    print(f"Location Status: {location_response.status_code}")
    print(f"Location Response: {location_response.json()}")
```

---

## Testing in JavaScript (Browser Console)

```javascript
// Register user
fetch('https://densityx-ai.onrender.com/user/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ticket_id: 'DX-005491',
    name: 'Test User',
    phone: '9876543210'
  })
})
.then(r => r.json())
.then(d => {
  console.log('Registration:', d);
  
  // Update location
  return fetch('https://densityx-ai.onrender.com/user/location', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ticket_id: 'DX-005491',
      latitude: 13.0851,
      longitude: 80.2101,
      gps_enabled: true
    })
  });
})
.then(r => r.json())
.then(d => console.log('Location Update:', d));
```

---

## Frontend Integration Example

Using the provided `apiClient.js`:

```javascript
import { apiClient } from './services/apiClient.js';

// Register user
try {
  const result = await apiClient.registerUser(
    'DX-005491',           // ticket_id
    'John Doe',            // name
    '9876543210'           // phone
  );
  console.log('Registered:', result);
} catch (error) {
  console.error('Registration failed:', error);
}

// Update location
try {
  const result = await apiClient.updateLocation(
    'DX-005491',           // ticket_id
    13.0851,               // latitude
    80.2101,               // longitude
    true                   // gps_enabled
  );
  console.log('Location updated:', result);
} catch (error) {
  console.error('Location update failed:', error);
}
```

---

## Postman Testing

### Step 1: Create POST Request
1. Open Postman
2. Click **+** to create new request
3. Change method to **POST**
4. Enter URL: `https://densityx-ai.onrender.com/user/register`

### Step 2: Add Headers
1. Click **Headers** tab
2. Add header:
   - Key: `Content-Type`
   - Value: `application/json`

### Step 3: Add Body
1. Click **Body** tab
2. Select **raw**
3. Select **JSON** from dropdown
4. Paste:
```json
{
  "ticket_id": "DX-005491",
  "name": "Test User",
  "phone": "9876543210"
}
```

### Step 4: Send
Click **Send** button

### Expected Response (201)
```json
{
  "status": "registered",
  "ticket_id": "DX-005491",
  "message": "User Test User registered. Please enable GPS."
}
```

---

## Quick Reference

| Item | Value |
|------|-------|
| Register Endpoint | POST /user/register |
| Update Location Endpoint | POST /user/location |
| Get Profile Endpoint | GET /user/me |
| Required Fields | ticket_id, name, phone |
| Ticket Format | DX-XXXXXX (6 digits) |
| Valid Tickets | See tickets.csv |
| Base URL | https://densityx-ai.onrender.com |

---

## Verification Steps

✅ **Step 1**: Health check responds
```bash
curl https://densityx-ai.onrender.com/health
# Should return: {"status":"healthy",...}
```

✅ **Step 2**: Register user successfully
```bash
curl -X POST https://densityx-ai.onrender.com/user/register \
  -H "Content-Type: application/json" \
  -d '{"ticket_id":"DX-005491","name":"Test","phone":"1234567890"}'
# Should return 201 with registration message
```

✅ **Step 3**: Update location successfully
```bash
curl -X POST https://densityx-ai.onrender.com/user/location \
  -H "Content-Type: application/json" \
  -d '{"ticket_id":"DX-005491","latitude":13.0851,"longitude":80.2101,"gps_enabled":true}'
# Should return 200 with location update message
```

✅ **Step 4**: Check user appears in crowd data
```bash
curl https://densityx-ai.onrender.com/crowd/locations
# Should include user as a point: {"lat":13.0851,"lon":80.2101}
```

---

## Troubleshooting

**Q: Getting "Method Not Allowed"?**  
A: Make sure you're using `-X POST` (not GET)

**Q: Getting "Invalid ticket ID"?**  
A: Use a valid ticket from backend/tickets.csv (e.g., DX-005491)

**Q: Getting validation error?**  
A: Make sure all 3 fields are present: ticket_id, name, phone

**Q: User not appearing in crowd data?**  
A: User location needs to be updated with gps_enabled=true for clustering

**Q: Network timeout?**  
A: Check if backend is running: curl https://densityx-ai.onrender.com/health

---

**All tests passing?** ✅ Registration system is working correctly!
