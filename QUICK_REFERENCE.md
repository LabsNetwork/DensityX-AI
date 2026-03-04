# Firebase Integration - Quick Reference Card

Print this or keep handy during setup!

---

## 🚀 3-Step Quick Start

### Step 1: Get Credentials (2 min)
```
1. Go to Firebase Console → your project
2. Settings ⚙️ → Service Accounts → Generate Private Key
3. Save JSON file (keep it private!)
```

### Step 2: Configure Backend (2 min)
```bash
cd backend
cp .env.example .env
nano .env
# Add: FIREBASE_CREDENTIALS_JSON, FIREBASE_DATABASE_URL, FIREBASE_STORAGE_BUCKET
```

### Step 3: Run (1 min)
```bash
bash firebase_quickstart.sh
# OR
python -m venv venv && source venv/bin/activate && pip install -r requirements.txt
python main.py
```

**Expected output:** `[startup] Firebase connected successfully!`

---

## 📋 Setup Checklist

- [ ] Firebase project created
- [ ] Service account JSON downloaded
- [ ] .env file created with credentials
- [ ] Firebase Auth enabled
- [ ] Firebase Database created
- [ ] Python dependencies installed
- [ ] Server starts successfully
- [ ] See "Firebase connected successfully!" in logs

---

## 🧪 Testing APIs

```bash
# Register user
curl -X POST http://localhost:8003/user/register \
  -H "Content-Type: application/json" \
  -d '{"ticket_id":"TEST-001","name":"User","phone":"9999"}'

# Update location
curl -X POST http://localhost:8003/user/location \
  -H "Content-Type: application/json" \
  -d '{"ticket_id":"TEST-001","latitude":13.085,"longitude":80.210,"gps_enabled":true}'

# Check active users
curl http://localhost:8003/user/active-count

# Health check
curl http://localhost:8003/health
```

**Then check Firebase Console → Realtime Database for data!**

---

## 📂 Key Files

| File | Purpose |
|------|---------|
| `backend/firebase_config.py` | Firebase module |
| `backend/.env` | Your credentials (create from .env.example) |
| `FIREBASE_README.md` | Start here |
| `FIREBASE_SETUP_INSTRUCTIONS.md` | Full setup guide |
| `FIREBASE_VERIFICATION_CHECKLIST.md` | Test each step |

---

## ⚠️ Important

```
❌ Never:
- Commit .env file
- Commit firebase-credentials.json
- Share JSON file
- Put credentials in code

✅ Always:
- Use environment variables
- Keep JSON file private
- Add to .gitignore
- Update .env only locally
```

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| "credentials not found" | Check .env exists, set FIREBASE_CREDENTIALS_JSON |
| Firebase won't connect | Verify JSON is valid, check URLs |
| No data syncing | Check Security Rules (test mode = allow all) |
| Server won't start | Run `pip install -r requirements.txt` |
| Import errors | Activate venv: `source venv/bin/activate` |

---

## 📞 Need Help?

1. Read: `FIREBASE_SETUP_INSTRUCTIONS.md` (main guide)
2. Check: `FIREBASE_VERIFICATION_CHECKLIST.md` (verify each step)
3. Reference: `FIREBASE_SETUP.md` (technical details)
4. Check server logs for `[firebase]` messages

---

## 🎯 Success Indicators

✅ You're done when:
1. Server logs show "Firebase connected successfully!"
2. Can register users via API
3. Data appears in Firebase console
4. Location updates sync in real-time
5. API responses are correct

---

## 📞 Commands You Need

```bash
# Go to backend
cd /Users/pratyush/git/DensityX-AI/backend

# Create .env
cp .env.example .env

# Edit .env (add your credentials)
nano .env

# Create venv
python3 -m venv venv

# Activate venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start server
python main.py

# In another terminal, test API
curl -X POST http://localhost:8003/user/register \
  -H "Content-Type: application/json" \
  -d '{"ticket_id":"TEST","name":"User","phone":"9999"}'
```

---

## 🔑 What Goes in .env

```dotenv
# Get these from Firebase Console
FIREBASE_CREDENTIALS_JSON='{"type":"service_account","project_id":"xxx",...}'
FIREBASE_DATABASE_URL="https://your-project.firebaseio.com"
FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
```

---

## 📊 Firebase Database Structure

After setup, you'll see:
```
users/
  TEST-001/
    name: "User"
    phone: "9999"
    gps_enabled: false
    
locations/
  TEST-001/
    latitude: 13.085
    longitude: 80.210
    gps_enabled: true
```

---

## ✅ Production Checklist

Before deploying:
- [ ] Security rules set up in Firebase
- [ ] Environment variables configured (not .env)
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] No credentials in git
- [ ] Tested in staging

---

**Ready to go!** Start with Step 1 above → Get Firebase Credentials 🔥

Need step-by-step help? Read `FIREBASE_SETUP_INSTRUCTIONS.md`
