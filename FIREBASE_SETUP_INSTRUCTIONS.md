# Firebase Integration Setup - Step by Step

## 📋 Summary of Integration

Your DensityX-AI backend now has complete Firebase integration for:
- ✅ Real-time user management
- ✅ Location data synchronization  
- ✅ Density alerts storage
- ✅ Cloud-based scalable backend

## 🔧 What's Been Done (Already Completed)

### Backend Files Created/Modified:

1. **firebase_config.py** - Firebase initialization module
   - Loads credentials from environment
   - Provides helper functions for user/location/alert operations
   - Graceful error handling

2. **main.py** - Updated to initialize Firebase on startup
   - Automatic Firebase connection attempt
   - Server continues if Firebase unavailable (graceful fallback)

3. **api/user_routes.py** - Updated to sync to Firebase
   - `POST /user/register` → saves to Firebase
   - `POST /user/location` → syncs to Firebase
   - All real-time updates backed by Firebase

4. **requirements.txt** - Added Firebase dependencies
   - `firebase-admin>=6.0.0`
   - `python-dotenv`

5. **.env.example** - Template with Firebase config
   - Ready to fill with your credentials

6. **FIREBASE_SETUP.md** - Detailed setup guide
   - Step-by-step Firebase configuration
   - Security rules
   - Troubleshooting

7. **firebase_quickstart.sh** - Automated setup script
   - One-command setup for development

---

## 🚀 What You Need to Do (Critical Steps)

### Step 1: Get Firebase Service Account Key
**YOU MUST DO THIS**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click ⚙️ Settings (top left)
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. **Save the JSON file securely** (never commit to Git!)

### Step 2: Set Up Environment Variables
**DO THIS BEFORE RUNNING SERVER**

```bash
cd /Users/pratyush/git/DensityX-AI/backend

# Create .env file
cp .env.example .env

# Edit .env with your Firebase info
nano .env  # or use VS Code to edit
```

**What to add in .env:**

Option A (Recommended - Secure):
```
FIREBASE_CREDENTIALS_JSON='{"type":"service_account","project_id":"your-project-id","private_key":"-----BEGIN PRIVATE KEY-----\n...","client_email":"firebase-adminsdk-xxx@your-project-id.iam.gserviceaccount.com",...}'
FIREBASE_DATABASE_URL="https://your-project-id.firebaseio.com"
FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
```

Option B (For Development):
```
FIREBASE_CREDENTIALS_PATH="firebase-credentials.json"
FIREBASE_DATABASE_URL="https://your-project-id.firebaseio.com"
FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
```
Then place the JSON file in the backend directory.

### Step 3: Enable Firebase Services
**DO THIS IN FIREBASE CONSOLE**

1. **Authentication** → Enable Email/Password
2. **Realtime Database** → Create Database (test mode is fine for development)
3. **Storage** → Create Storage Bucket (optional)

### Step 4: Install Dependencies
```bash
cd /Users/pratyush/git/DensityX-AI/backend

# Option A: Use quickstart script
bash firebase_quickstart.sh

# Option B: Manual
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Step 5: Start the Server
```bash
python main.py
```

**Check for this message in logs:**
```
[startup] Initializing Firebase Admin SDK...
[startup] Firebase connected successfully!
```

If you see this → ✅ Firebase is connected!

---

## 🔐 Security: Important Notes

### ⚠️ NEVER Do This:
```
❌ Don't commit firebase-credentials.json
❌ Don't share the JSON file
❌ Don't paste credentials in code
```

### ✅ DO This Instead:
```
✅ Use .env file (add to .gitignore)
✅ Use environment variables in production
✅ Keep JSON file local only
✅ Rotate credentials regularly
```

### Production Security Rules
When deploying to production, add these Firebase Realtime Database rules:

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

---

## 📊 Testing Firebase Integration

### Test 1: Check Server Startup
```bash
# Run server
python main.py

# Look for:
[startup] Initializing Firebase Admin SDK...
[startup] Firebase connected successfully!
[startup] SIMULATION MODE: generating crowd every 2s
[startup] DBSCAN clustering every 10s
```

### Test 2: Register a User
```bash
curl -X POST http://localhost:8003/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "DX-TEST-001",
    "name": "Test User",
    "phone": "9999999999"
  }'
```

### Test 3: Update Location
```bash
curl -X POST http://localhost:8003/user/location \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "DX-TEST-001",
    "latitude": 13.0850,
    "longitude": 80.2101,
    "gps_enabled": true
  }'
```

### Test 4: Check Firebase Console
Go to Firebase Console → Realtime Database:
- You should see `users/DX-TEST-001`
- You should see `locations/DX-TEST-001`

If you see data → ✅ Firebase sync is working!

---

## 🆘 Troubleshooting

### Problem: "Firebase credentials not found"
**Solution:**
1. Check .env file exists
2. Check FIREBASE_CREDENTIALS_JSON is set correctly
3. If using file, check firebase-credentials.json exists
4. Reload terminal/restart server

### Problem: "Failed to initialize Firebase"
**Solution:**
1. Verify service account JSON is valid (copy from Firebase Console again)
2. Check Firebase project is active
3. Check database is enabled in Firebase
4. Check all required roles are assigned to service account

### Problem: Server starts but Firebase seems to fail silently
**This is expected!** The server has graceful fallback. Data is stored in memory. Check:
1. Firebase Console Realtime Database tab
2. Look for any error messages
3. Check Security Rules aren't blocking access
4. Verify FIREBASE_DATABASE_URL is correct

### Problem: No data appearing in Firebase
**Solution:**
1. Check server logs for [firebase] messages
2. Verify Security Rules allow writes (test mode allows all)
3. Verify FIREBASE_DATABASE_URL in .env
4. Check JSON credentials include database permissions

---

## 📈 Firebase Database Structure

After setup, you'll see this structure:

```
your-firebase-project
├── users
│   └── DX-001
│       ├── ticket_id: "DX-001"
│       ├── name: "User Name"
│       ├── phone: "9999999999"
│       ├── latitude: 13.0850
│       ├── longitude: 80.2101
│       ├── gps_enabled: true
│       ├── registered_at: "2026-03-01T12:00:00"
│       └── last_updated: "2026-03-01T12:05:00"
│
├── locations
│   └── DX-001
│       ├── ticket_id: "DX-001"
│       ├── latitude: 13.0850
│       ├── longitude: 80.2101
│       ├── gps_enabled: true
│       └── timestamp: "2026-03-01T12:05:00"
│
└── alerts
    └── alert-id-1234
        ├── cluster_count: 2
        ├── cluster_sizes: [85, 120]
        ├── risk_flags: [true, true]
        └── timestamp: "2026-03-01T12:10:00"
```

---

## ✅ Checklist

Before you test:

- [ ] Firebase project created
- [ ] Service account key downloaded
- [ ] .env file created with Firebase credentials
- [ ] FIREBASE_CREDENTIALS_JSON set (or credentials file placed)
- [ ] FIREBASE_DATABASE_URL set
- [ ] FIREBASE_STORAGE_BUCKET set
- [ ] Firebase Authentication enabled
- [ ] Firebase Realtime Database created
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] Server can start (`python main.py`)
- [ ] See "Firebase connected successfully!" in logs
- [ ] Data appears in Firebase Console

---

## 🎯 Next Steps

After verifying Firebase works:

1. **Connect Frontend** - Add Firebase Web SDK to React app
2. **Real-time Sync** - Set up Firebase listeners for live updates
3. **Notifications** - Configure Firebase Cloud Messaging for alerts
4. **Analytics** - Query Firebase data for dashboards
5. **Production** - Deploy with environment variables, enable security rules

---

## 📚 Documentation Files

- **FIREBASE_SETUP.md** - Complete technical setup guide
- **FIREBASE_INTEGRATION_COMPLETE.md** - Feature overview
- **firebase_config.py** - Source code with function docs
- **.env.example** - Template with all variables

---

## 🚨 Important Reminders

1. **Email/Gmail**: When connecting your Gmail to Firebase, use the admin email for the project. Don't share it.

2. **Credentials**: Keep the JSON file private. Use environment variables in production.

3. **Testing**: Start with test mode in Firebase. Enable security rules before production.

4. **Fallback**: Server works without Firebase. If Firebase is down, data is still stored in memory.

---

**Your Firebase integration is ready to go! 🎉**

Questions? Check `FIREBASE_SETUP.md` for detailed guides and troubleshooting.
