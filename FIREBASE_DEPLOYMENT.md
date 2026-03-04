# 🚀 DensityX-AI Firebase Deployment Guide

## One-Command Deployment

```bash
npm run deploy
```

That's it. This command will:
1. ✅ Install dependencies
2. ✅ Build the frontend
3. ✅ Deploy to Firebase Hosting
4. ✅ Display your live URL

## First-Time Setup

```bash
npm run setup
```

This initializes:
- Firebase project configuration (.firebaserc linkage)
- Database security rules
- Firestore security rules
- Environment variables

## Deployment Verification

```bash
npm run verify
```

Checks:
- ✅ Site accessibility (HTTP 200)
- ✅ Firebase Console connection
- ✅ Database connectivity
- ✅ Cluster data access

---

## Architecture

### Frontend (React + Vite)
- **Location:** `frontend/`
- **Build Output:** `frontend/dist/`
- **Hosting:** Firebase Hosting
- **Assets:** Optimized with cache headers

### Backend (FastAPI)
- **Location:** `backend/`
- **Port:** 8003 (development only)
- **Database:** Firebase Realtime DB
- **Verification:** CSV-based ticket validation

### Firebase Services
- **Hosting:** https://density-bbe08.web.app
- **Realtime Database:** Real-time cluster synchronization
- **Authentication:** Google + Email login (optional)
- **Firestore:** Structured data (optional)

---

## Environment Configuration

### Production (.env.production)
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=density-bbe08
VITE_API_BASE_URL=https://density-bbe08.web.app/api
```

### Development (.env.development)
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=density-bbe08
VITE_API_BASE_URL=http://localhost:8003/api
```

---

## File Structure

```
DensityX-AI/
├── .firebaserc                 # Project ID configuration
├── firebase.json               # Hosting & database config
├── database.rules.json         # Realtime DB security rules
├── firestore.rules             # Firestore security rules
├── deploy.sh                   # One-command deployment
├── setup-firebase.sh           # Firebase initialization
├── verify-deployment.sh        # Deployment verification
├── frontend/
│   ├── .env.production         # Firebase keys (production)
│   ├── .env.development        # Firebase keys (development)
│   ├── package.json            # Deployment scripts
│   ├── src/
│   │   ├── firebase.js         # Firebase SDK init
│   │   ├── auth.js             # Authentication service
│   │   ├── offlineHandler.js   # Offline/fallback mode
│   │   └── connectionChecker.js # Connection diagnostics
│   └── dist/                   # Build output (created by npm run build)
└── backend/
    ├── firebase_config.py      # Python Firebase init
    └── main.py                 # FastAPI server
```

---

## Troubleshooting

### "Site Not Found" (404)
1. Ensure `frontend/dist/` exists: `npm run build`
2. Check `.firebaserc` has correct project ID
3. Verify `firebase.json` has `"public": "frontend/dist"`

### No clusters appearing
1. Check Firebase Realtime Database has cluster data
2. Verify database rules allow read access
3. Check browser console for connection errors
4. Run `npm run verify` to check connectivity

### Connection errors
1. Check internet connection
2. Verify Firebase project credentials in .env files
3. Check browser DevTools Network tab
4. Check Firebase Console for errors

### Build fails
1. Clear node_modules: `rm -rf frontend/node_modules`
2. Clear npm cache: `npm cache clean --force`
3. Reinstall: `npm install` in frontend/
4. Try build again: `npm run build`

---

## Security Features

- **Verified-Only Clustering:** Only verified users' GPS data in clusters
- **CSV Ticket Validation:** Ticket-based verification system
- **GPS Gate:** Unverified users get 403 Forbidden response
- **Firebase Rules:** Read-only public clusters, write-protected

---

## Monitoring

Monitor deployment in **Firebase Console:**
- https://console.firebase.google.com/project/density-bbe08
- Hosting tab: View deployment logs
- Realtime Database: View cluster data
- Functions: Monitor any serverless functions

---

## Local Development

### Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on http://localhost:5173

### Start Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run_server.py
```
Runs on http://localhost:8003

---

## Next Steps

1. **Deploy:** `npm run deploy`
2. **Verify:** `npm run verify`
3. **Monitor:** Check Firebase Console
4. **Test:** Visit https://density-bbe08.web.app
5. **Debug:** Check browser console & Firebase logs if issues

---

**Status:** ✅ Fully automated, production-ready

For detailed architecture info, see [ARCHITECTURE.md](../ARCHITECTURE.md)
