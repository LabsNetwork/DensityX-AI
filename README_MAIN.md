# 🎯 DensityX-AI: Real-time Crowd Density Management System

[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![Node 16+](https://img.shields.io/badge/node-16+-green.svg)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/firebase-realtime%20db-orange.svg)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Real-time crowd density monitoring and management system using FastAPI, React, and Firebase.**

---

## 🚀 Quick Start (Choose Your Path)

### For New Collaborators
```bash
git clone https://github.com/your-org/DensityX-AI.git
cd DensityX-AI
bash setup.sh
```
Then follow [COLLABORATOR_ONBOARDING.md](./COLLABORATOR_ONBOARDING.md) 📖

### For Existing Team Members
```bash
cd /Users/pratyush/git/DensityX-AI
bash backend/start_server.sh
```

---

## 📋 System Requirements

| Component | Requirement | Download |
|-----------|-------------|----------|
| Python | 3.8+ | [python.org](https://www.python.org/downloads/) |
| Node.js | 16+ | [nodejs.org](https://nodejs.org/) |
| Git | Latest | [git-scm.com](https://git-scm.com/) |
| macOS | Any version | (Built for macOS with LaunchAgent) |

---

## 🏗️ Architecture Overview

```
DensityX-AI
│
├─ Backend (FastAPI + Python)
│  ├─ Real-time density analysis (DBSCAN clustering)
│  ├─ User location tracking
│  ├─ Firebase integration
│  └─ REST API endpoints
│
├─ Frontend (React + Vite)
│  ├─ Real-time dashboard
│  ├─ User onboarding
│  └─ Crowd visualization
│
└─ Infrastructure
   ├─ Firebase Realtime Database
   ├─ Cloud Storage
   └─ macOS LaunchAgent (24/7 operation)
```

---

## 📦 What's Included

### ✅ Backend Features
- **FastAPI** - Modern Python web framework
- **Firebase Integration** - Real-time data syncing
- **DBSCAN Clustering** - Density analysis
- **REST APIs** - User registration, location tracking
- **Auto-restart** - 24/7 operation
- **Comprehensive Logging** - Debug and monitor

### ✅ Frontend Features
- **React + Vite** - Fast development
- **Real-time Dashboard** - Live updates
- **User Onboarding** - Guided setup
- **Responsive Design** - Mobile-friendly

### ✅ Infrastructure
- **LaunchAgent** - Auto-start on Mac login
- **Crash Recovery** - Auto-restart on failure
- **Environment Config** - Secure credentials
- **Logs Management** - 24/7 monitoring

---

## 🔧 Configuration

### Environment Variables
Copy `.env.example` to `.env` and fill in:

```bash
# Firebase
FIREBASE_CREDENTIALS_JSON='{"type":"service_account",...}'
FIREBASE_DATABASE_URL='https://your-project.firebaseio.com'
FIREBASE_STORAGE_BUCKET='your-project.appspot.com'
```

Get these from Firebase Console → Project Settings → Service Accounts

### File Locations
- Backend config: `backend/.env`
- Frontend config: `frontend/.env` (if needed)
- Server logs: `backend/logs/server.log`
- Error logs: `backend/logs/server_error.log`

---

## 🎯 Getting Started

### 1. Initial Setup (5 minutes)
```bash
bash setup.sh
```

### 2. Configure Firebase
```bash
nano backend/.env
# Add your Firebase credentials
```

### 3. Start Backend Server

**Option A: VSCode Run Button (Recommended)**
- Press `Ctrl+Shift+D` (Cmd+Shift+D on Mac)
- Select "Run DensityX-AI Backend"
- Click play button

**Option B: Terminal**
```bash
cd backend
bash start_server.sh
```

### 4. Test Server
```bash
curl http://127.0.0.1:8003/health
```

### 5. Start Frontend (Optional)
```bash
cd frontend
npm run dev
# Open http://localhost:5173
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [COLLABORATOR_ONBOARDING.md](./COLLABORATOR_ONBOARDING.md) | **👈 Start here for new team members** |
| [PERSISTENT_SERVER_SETUP.md](./PERSISTENT_SERVER_SETUP.md) | 24/7 server operation setup |
| [QUICK_START_SERVER.md](./QUICK_START_SERVER.md) | Quick reference guide |
| [backend/README.md](./backend/README.md) | Backend documentation |
| [frontend/README.md](./frontend/README.md) | Frontend documentation |

---

## 🔌 API Endpoints

### Health & Status
```bash
GET /health                    # Server status
GET /user/active-count         # Active users count
```

### User Management
```bash
POST /user/register            # Register new user
POST /user/location            # Update location
GET /user/me                   # Get user profile
GET /user/active-users         # List all users
```

### Density Analysis
```bash
GET /density/clusters          # Get density clusters
GET /density/heatmap           # Get heatmap data
POST /density/alerts           # Create density alert
```

See [API Documentation](./docs/API.md) for complete reference.

---

## 🐛 Troubleshooting

### "Connection refused" at localhost:8003

Use `127.0.0.1` instead of `localhost`:
```bash
# ✅ Correct
curl http://127.0.0.1:8003/health

# ❌ Wrong
curl http://localhost:8003/health
```

### Server won't start

Check logs:
```bash
tail -f backend/logs/server.log
tail -f backend/logs/server_error.log
```

Common causes:
- Port 8003 already in use: `pkill -f "python main.py"`
- Missing Firebase credentials: Check `backend/.env`
- Python venv not activated: Run `bash setup.sh`

### "Module not found" errors

Reinstall dependencies:
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### Full Troubleshooting Guide
See [COLLABORATOR_ONBOARDING.md - Troubleshooting](./COLLABORATOR_ONBOARDING.md#-troubleshooting)

---

## 🔒 Security Practices

✅ **Do's:**
- Keep `.env` files private (don't commit)
- Use `.env.example` as template
- Share credentials through secure channels
- Update dependencies regularly
- Review code before pushing

❌ **Don'ts:**
- Don't hardcode secrets in code
- Don't commit `.env` files
- Don't commit `venv/` or `node_modules/`
- Don't share credentials in Git
- Don't skip security checks

---

## 🚀 Development Workflow

### Making Changes
```bash
# 1. Create feature branch
git checkout -b feature/your-feature

# 2. Make changes and test
bash backend/start_server.sh
# Test in browser or with curl

# 3. Commit with clear message
git add .
git commit -m "feat: describe your feature"

# 4. Push and create PR
git push origin feature/your-feature
```

### Code Style
- Python: [PEP 8](https://pep8.org/) (enforced by Black)
- JavaScript: [Prettier](https://prettier.io/) (auto-formatted)
- Commit messages: Conventional Commits

### Testing
```bash
# Backend tests
cd backend
source venv/bin/activate
python -m pytest tests/

# Frontend tests
cd frontend
npm run test
```

---

## 📊 Server Management

### Start Server
```bash
bash backend/start_server.sh
```

### Stop Server
```bash
pkill -f "python main.py"
```

### View Logs
```bash
# Live logs
tail -f backend/logs/server.log

# Error logs
tail -f backend/logs/server_error.log

# Both
tail -f backend/logs/*.log
```

### Check Status
```bash
ps aux | grep python | grep main.py
lsof -i :8003
curl http://127.0.0.1:8003/health
```

### Server Runs 24/7
✅ Auto-starts on Mac login
✅ Auto-restarts if crashes
✅ Keeps running continuously
✅ No manual intervention needed

---

## 🤝 Contributing

### Workflow
1. Fork repository (for external collaborators)
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes and test thoroughly
4. Commit with clear messages
5. Create Pull Request with description
6. Wait for code review
7. Merge after approval

### Pull Request Requirements
- ✅ All tests passing
- ✅ No secrets committed
- ✅ Code follows style guide
- ✅ Documentation updated
- ✅ Tested locally

### Getting Help
- **Documentation**: Read guides above
- **Team Chat**: Ask in Slack/Discord
- **Issues**: Create GitHub issue with detailed info
- **PR Review**: Ask for help in PR comments

---

## 📈 Project Status

| Component | Status |
|-----------|--------|
| Backend Server | ✅ Production Ready |
| Firebase Integration | ✅ Fully Integrated |
| 24/7 Operation | ✅ Auto-restart Enabled |
| Frontend | ✅ Under Development |
| Documentation | ✅ Complete |
| Collaboration Setup | ✅ Ready |

---

## 📞 Quick Reference

```bash
# Setup & Config
bash setup.sh                          # One-time setup
nano backend/.env                      # Add Firebase credentials

# Running
cd backend && bash start_server.sh     # Start backend
cd frontend && npm run dev             # Start frontend
curl http://127.0.0.1:8003/health      # Test server

# Development
git checkout -b feature/name           # Create branch
git add .                              # Stage changes
git commit -m "feat: description"      # Commit
git push                               # Push to GitHub

# Debugging
tail -f backend/logs/server.log        # View logs
ps aux | grep python                   # Check processes
lsof -i :8003                          # Check port
pkill -f "python main.py"              # Stop server

# Git
git status                             # Check status
git diff                               # Review changes
git log --oneline                      # View history
```

---

## 📅 Roadmap

- [ ] Frontend dashboard improvements
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Mobile app integration
- [ ] Deployment to cloud

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Lead**: Pratyush (Backend + Infrastructure)
- **Collaborators**: Your team members

---

## 🎯 Key Achievements

✅ **Backend**: Fully functional FastAPI server with Firebase integration  
✅ **24/7 Operation**: LaunchAgent configured for continuous operation  
✅ **Auto-Recovery**: Server auto-restarts on crash  
✅ **Security**: Environment variables for sensitive data  
✅ **Documentation**: Comprehensive guides for collaboration  
✅ **Developer Experience**: VSCode integration with run button  

---

## 📞 Support

For issues, questions, or suggestions:

1. **Check Documentation**
   - [COLLABORATOR_ONBOARDING.md](./COLLABORATOR_ONBOARDING.md)
   - [PERSISTENT_SERVER_SETUP.md](./PERSISTENT_SERVER_SETUP.md)
   - [Troubleshooting Guide](./COLLABORATOR_ONBOARDING.md#-troubleshooting)

2. **Create GitHub Issue**
   - Use [bug report template](./.github/ISSUE_TEMPLATE/bug_report.md)
   - Use [feature request template](./.github/ISSUE_TEMPLATE/feature_request.md)

3. **Ask Team Lead**
   - Architecture questions
   - Feature requirements
   - Firebase credentials

---

## 🎉 You're All Set!

Everything is configured and ready for:
- ✅ Seamless development
- ✅ Collaboration with team members
- ✅ 24/7 server operation
- ✅ Easy debugging and monitoring
- ✅ Git-based workflow

**Start coding now! 🚀**

---

**Last Updated**: March 1, 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
