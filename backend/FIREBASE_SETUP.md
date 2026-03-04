# Firebase Integration Setup Guide

## Overview
DensityX-AI backend is now fully integrated with Firebase for:
- User authentication and profile management
- Real-time location data synchronization
- Crowd density alert storage
- Scalable cloud database

## Prerequisites
1. Google Cloud Project with Firebase enabled
2. Firebase Project created
3. Service Account with Admin privileges

## Setup Steps

### Step 1: Get Your Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Settings** (gear icon) → **Service Accounts**
4. Click **Generate New Private Key**
5. Save the JSON file securely (never commit to Git)

### Step 2: Configure Environment Variables

You have TWO options:

#### Option A: Using Environment Variable (Recommended for Production)
```bash
# Export the service account JSON as environment variable
export FIREBASE_CREDENTIALS_JSON='{"type":"service_account","project_id":"your-project",...}'

# Also set these:
export FIREBASE_DATABASE_URL="https://your-project.firebaseio.com"
export FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
```

#### Option B: Using Credentials File (Development)
1. Place the JSON file in the backend root directory:
   ```
   DensityX-AI/backend/firebase-credentials.json
   ```
2. Set environment variables:
   ```bash
   export FIREBASE_DATABASE_URL="https://your-project.firebaseio.com"
   export FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
   ```

### Step 3: Enable Required Firebase Services

In Firebase Console:

1. **Authentication**
   - Enable Email/Password
   - Enable Google Sign-In (optional)

2. **Realtime Database**
   - Create database in test mode (for development)
   - Production: Set proper security rules

3. **Storage** (optional)
   - Create storage bucket

### Step 4: Install Dependencies

```bash
cd DensityX-AI/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install packages
pip install -r requirements.txt
```

### Step 5: Set Up Security Rules (Firebase Console)

#### Realtime Database Rules
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth.uid == $uid || root.child('admins').child(auth.uid).exists()",
        ".write": "auth.uid == $uid"
      }
    },
    "locations": {
      "$uid": {
        ".read": "root.child('admins').child(auth.uid).exists()",
        ".write": "auth.uid == $uid"
      }
    },
    "alerts": {
      ".read": "root.child('admins').child(auth.uid).exists()",
      ".write": "root.child('admins').child(auth.uid).exists()"
    }
  }
}
```

### Step 6: Start the Backend Server

```bash
cd DensityX-AI/backend
python main.py
```

You should see:
```
[startup] Initializing Firebase Admin SDK...
[startup] Firebase connected successfully!
[startup] SIMULATION MODE: generating crowd every 2s
[startup] DBSCAN clustering every 10s
```

## Firebase Integration Points

### 1. User Registration → Firebase
When a user registers via `/user/register`:
- User profile saved to `users/{ticket_id}`
- Contains: name, phone, registration time
- Memory store remains source of truth for real-time data

### 2. Location Updates → Firebase
Every location update via `/user/location`:
- Location data synced to `locations/{ticket_id}`
- Timestamp recorded for audit trail
- Enables real-time location map on Firebase dashboard

### 3. Density Alerts → Firebase
High-density alerts automatically:
- Saved to `alerts/{timestamp}`
- Include cluster info and risk flags
- Can trigger real-time notifications

## Testing Firebase Connection

### Option 1: Check Startup Logs
Run the server and look for:
```
[startup] Firebase connected successfully!
```

### Option 2: Test Endpoint
```bash
# Register a user
curl -X POST http://localhost:8003/user/register \
  -H "Content-Type: application/json" \
  -d '{"ticket_id":"DX-001","name":"Test User","phone":"9999999999"}'

# Check if data appears in Firebase Console
# Go to Realtime Database → users → DX-001
```

## Troubleshooting

### Error: "Firebase credentials not found"
- Check `FIREBASE_CREDENTIALS_JSON` environment variable is set correctly
- OR verify `firebase-credentials.json` exists in backend directory
- Check file is valid JSON

### Error: "Failed to initialize Firebase"
- Verify service account has proper permissions
- Check Firebase project exists and is active
- Ensure FIREBASE_DATABASE_URL is correct

### Firebase Operations Failing (But Server Still Runs)
- This is intentional - memory store is the fallback
- Check Firebase Console for issues
- Verify database/storage is enabled in project

## Production Deployment

1. **Use Environment Variables Only** - never commit credentials
2. **Enable Security Rules** - restrict database access
3. **Set Up Backup** - enable automated backups
4. **Monitor** - use Firebase monitoring dashboard
5. **Scaling** - Firebase Realtime Database auto-scales

## Frontend Integration

When you're ready to connect the frontend:

1. Install Firebase JavaScript SDK
2. Use service account to get ID tokens
3. Pass tokens in `Authorization: Bearer <token>` header
4. Frontend can sync in real-time using Firebase listeners

## Need Help?

- [Firebase Admin Python SDK Docs](https://firebase.google.com/docs/database/admin/start)
- [Firebase Realtime Database Guide](https://firebase.google.com/docs/database)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
