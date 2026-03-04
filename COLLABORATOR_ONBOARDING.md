# 👥 Collaborator Onboarding Guide

Welcome to DensityX-AI! This guide will help you get set up and start contributing immediately.

## 🚀 Quick Start (5 Minutes)

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/DensityX-AI.git
cd DensityX-AI
```

### 2. Run Setup Script
```bash
bash setup.sh
```

This script will:
- ✅ Create Python virtual environment
- ✅ Install all dependencies
- ✅ Set up Firebase configuration template
- ✅ Configure logs directory
- ✅ Set up VSCode for seamless development

### 3. Add Firebase Credentials
Ask your team lead for Firebase credentials, then:

```bash
# Edit the environment file
nano backend/.env
```

Add these three lines:
```
FIREBASE_CREDENTIALS_JSON='{"type":"service_account",...}'
FIREBASE_DATABASE_URL='https://your-project.firebaseio.com'
FIREBASE_STORAGE_BUCKET='your-project.appspot.com'
```

### 4. Start the Server

**Option A: VSCode Run Button (Recommended)**
- Press `Ctrl+Shift+D` (or Cmd+Shift+D on Mac)
- Select "Run DensityX-AI Backend"
- Click the green play button

**Option B: Terminal**
```bash
cd backend
bash start_server.sh
```

### 5. Verify It Works
```bash
curl http://127.0.0.1:8003/health
```

Expected response:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "..."
}
```

✅ **You're ready to code!**

---

## 📁 Project Structure

```
DensityX-AI/
├── backend/                    # Python FastAPI server
│   ├── main.py                # Entry point
│   ├── firebase_config.py      # Firebase setup
│   ├── api/                    # API routes
│   ├── models/                 # Data models
│   ├── services/               # Business logic
│   ├── venv/                   # Virtual environment (don't commit)
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Your credentials (don't commit)
│   ├── .env.example            # Template
│   └── start_server.sh         # Startup script
│
├── frontend/                   # React Vite application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── setup.sh                    # One-time setup script
├── .gitignore                  # Prevents committing sensitive files
├── .vscode/
│   ├── launch.json             # VSCode run configurations
│   ├── tasks.json              # VSCode tasks
│   └── settings.json           # VSCode settings
│
└── docs/                       # Documentation
```

---

## 🔧 Development Workflow

### Working on Backend

```bash
# 1. Make sure server is running
cd backend
bash start_server.sh

# 2. Edit your Python files in backend/
# 3. Test with curl or Postman
curl -X POST http://127.0.0.1:8003/user/register \
  -H "Content-Type: application/json" \
  -d '{"ticket_id":"DX-005491","name":"Test","phone":"9999999999"}'

# 4. Commit your changes
git add .
git commit -m "feat: add new endpoint"
git push
```

### Working on Frontend

```bash
# 1. Terminal 1: Start backend
cd backend && bash start_server.sh

# 2. Terminal 2: Start frontend
cd frontend
npm run dev

# 3. Open http://localhost:5173 in browser
# 4. Edit files in frontend/src/
# 5. Changes will reload automatically
```

### Server Auto-Restart (24/7 Operation)

Your server:
- ✅ Auto-starts when Mac boots
- ✅ Restarts if it crashes
- ✅ Keeps running 24/7
- ✅ No manual intervention needed

To manually restart:
```bash
pkill -f "python main.py"
sleep 2
cd backend && bash start_server.sh
```

---

## 🐛 Troubleshooting

### Issue: "Connection refused" at `http://localhost:8003`

**Fix:** Always use `127.0.0.1` instead of `localhost`:
```bash
# ✅ Correct
curl http://127.0.0.1:8003/health

# ❌ Wrong
curl http://localhost:8003/health
```

### Issue: "Module not found" errors

**Fix:** Make sure venv is activated and dependencies installed:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Issue: Python version mismatch

**Check your Python version:**
```bash
python3 --version
```

Required: Python 3.8 or higher

### Issue: Firebase credentials not loading

**Check .env file:**
```bash
cat backend/.env | grep FIREBASE
```

Should show your Firebase credentials. If empty or missing:
```bash
nano backend/.env
# Add the credentials
```

### Issue: Port 8003 already in use

**Find and stop the process:**
```bash
lsof -i :8003
pkill -f "python main.py"
```

### View Server Logs

```bash
# Live logs
tail -f backend/logs/server.log

# Error logs
tail -f backend/logs/server_error.log

# All logs
tail -f backend/logs/*.log
```

---

## 👨‍💻 Git Workflow

### Important: Never Commit These Files
- `.env` (contains Firebase credentials)
- `backend/venv/` (virtual environment)
- `frontend/node_modules/` (dependencies)
- `backend/logs/` (runtime logs)

These are already in `.gitignore` ✅

### Creating a Pull Request

```bash
# 1. Create a new branch
git checkout -b feature/your-feature-name

# 2. Make your changes
# 3. Test everything locally
curl http://127.0.0.1:8003/health

# 4. Commit with clear messages
git add .
git commit -m "feat: describe what you changed"
git push origin feature/your-feature-name

# 5. Create PR on GitHub
# Click "Compare & Pull Request"
# Add description of your changes
```

### Commit Message Format
```
feat: add new feature
fix: fix a bug
docs: update documentation
refactor: improve code structure
test: add tests
chore: update dependencies
```

---

## 📚 API Endpoints

### Health Check
```bash
GET http://127.0.0.1:8003/health
```

### User Management
```bash
# Register new user
POST http://127.0.0.1:8003/user/register
Body: {
  "ticket_id": "DX-005491",
  "name": "User Name",
  "phone": "9999999999"
}

# Update location
POST http://127.0.0.1:8003/user/location
Body: {
  "ticket_id": "DX-005491",
  "latitude": 13.0850,
  "longitude": 80.2101,
  "gps_enabled": true
}

# Get active users
GET http://127.0.0.1:8003/user/active-count
```

See [API Documentation](./API_DOCUMENTATION.md) for complete reference.

---

## 🔐 Security Best Practices

1. **Never commit .env files**
   - Use `.env.example` template instead
   - Share credentials through secure channels (not Git)

2. **Keep dependencies updated**
   ```bash
   cd backend
   pip install --upgrade -r requirements.txt
   ```

3. **Use environment variables for secrets**
   - Database credentials in `.env`
   - API keys in `.env`
   - Never hardcode secrets

4. **Review code before pushing**
   ```bash
   git diff
   git status
   ```

---

## 💬 Getting Help

### Check Documentation
- Backend README: [backend/README.md](./backend/README.md)
- Frontend README: [frontend/README.md](./frontend/README.md)
- Setup Guide: [PERSISTENT_SERVER_SETUP.md](./PERSISTENT_SERVER_SETUP.md)
- Quick Reference: [QUICK_START_SERVER.md](./QUICK_START_SERVER.md)

### Ask Team Lead
- Firebase credentials
- Project architecture questions
- Feature requirements

### Common Issues
- Check [Troubleshooting](#-troubleshooting) section above
- Check server logs: `tail -f backend/logs/server.log`
- Ask in team Slack/Discord

---

## ✨ VSCode Extensions (Recommended)

1. **Python** - Microsoft Python extension
2. **Pylance** - Python type checking
3. **REST Client** - Test API endpoints
4. **Thunder Client** - API testing
5. **Prettier** - Code formatter
6. **ESLint** - JavaScript linting

All will be installed automatically when you open the project.

---

## 🎯 Next Steps

1. ✅ Run `bash setup.sh`
2. ✅ Add Firebase credentials to `.env`
3. ✅ Start server (VSCode Run button or `bash start_server.sh`)
4. ✅ Test with `curl http://127.0.0.1:8003/health`
5. ✅ Make your first commit
6. ✅ Push to your feature branch
7. ✅ Create a Pull Request

---

## 📞 Quick Commands Reference

```bash
# Setup
bash setup.sh                          # One-time setup

# Backend
cd backend
source venv/bin/activate              # Activate virtual environment
bash start_server.sh                   # Start server
pip install -r requirements.txt        # Install dependencies

# Frontend
cd frontend
npm install                            # Install dependencies
npm run dev                            # Start dev server

# Git
git checkout -b feature/name           # Create new branch
git add .                              # Stage changes
git commit -m "message"                # Commit
git push                               # Push to GitHub

# Testing
curl http://127.0.0.1:8003/health      # Test server
tail -f backend/logs/server.log        # View logs
```

---

**Welcome aboard! 🚀 Happy coding!**
