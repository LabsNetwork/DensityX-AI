📖 **DensityX-AI Documentation Index**

# Start Here! 👋

Welcome to DensityX-AI! Choose your path based on your role:

---

## 🆕 I'm a New Team Member
**Start here:** [COLLABORATOR_ONBOARDING.md](./COLLABORATOR_ONBOARDING.md)
- 15-minute setup guide
- Step-by-step instructions
- Troubleshooting help
- Quick reference

👉 **Read this first!**

---

## 👨‍💻 I'm Working on Code Today
**Start here:** [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)
- Daily workflow
- Making changes
- Testing code
- Debugging tips
- Common commands

---

## 📋 I Want Project Overview
**Start here:** [README_MAIN.md](./README_MAIN.md)
- Architecture overview
- Features & capabilities
- Project structure
- API endpoints
- Contributing guide

---

## 🔧 I'm Setting Up Persistence/Infrastructure
**Start here:** [PERSISTENT_SERVER_SETUP.md](./PERSISTENT_SERVER_SETUP.md)
- 24/7 operation setup
- LaunchAgent configuration
- Monitoring server
- Troubleshooting guide

---

## ⚡ I Need Quick Commands
**Start here:** [QUICK_START_SERVER.md](./QUICK_START_SERVER.md)
- Essential commands
- Key fixes
- Status checks
- Quick troubleshooting

---

## ✅ I Want to Verify Everything is Set Up
**Start here:** [COLLABORATION_SETUP_COMPLETE.md](./COLLABORATION_SETUP_COMPLETE.md)
- What's been configured
- For collaborators
- Workflow overview
- Next steps

---

## 📁 Complete File Structure

```
DensityX-AI/
├─ README_MAIN.md                    (📖 Project overview)
├─ COLLABORATOR_ONBOARDING.md        (👉 START HERE if new)
├─ DEVELOPMENT_GUIDE.md              (Daily development work)
├─ PERSISTENT_SERVER_SETUP.md        (24/7 server setup)
├─ QUICK_START_SERVER.md             (Quick reference)
├─ COLLABORATION_SETUP_COMPLETE.md   (Setup verification)
├─ setup.sh                          (👈 Run once for setup)
│
├─ backend/
│  ├─ main.py                        (Server entry point)
│  ├─ firebase_config.py             (Firebase module)
│  ├─ start_server.sh                (Start server)
│  ├─ requirements.txt               (Python dependencies)
│  ├─ .env.example                   (Config template)
│  ├─ venv/                          (Virtual environment)
│  └─ logs/                          (Server logs)
│
├─ frontend/
│  ├─ src/                           (React components)
│  ├─ package.json                   (Node dependencies)
│  └─ vite.config.js                 (Build config)
│
├─ .vscode/
│  ├─ launch.json                    (Run configurations)
│  ├─ tasks.json                     (Build tasks)
│  └─ settings.json                  (IDE settings)
│
├─ .github/
│  ├─ ISSUE_TEMPLATE/
│  │  ├─ bug_report.md               (Bug report template)
│  │  └─ feature_request.md          (Feature template)
│  └─ PULL_REQUEST_TEMPLATE/
│     └─ default.md                  (PR template)
│
└─ .gitignore                        (Git ignore rules)
```

---

## 🚀 30-Second Quick Start

```bash
# Clone
git clone https://github.com/your-org/DensityX-AI.git
cd DensityX-AI

# Setup (one time)
bash setup.sh

# Configure (ask team lead)
nano backend/.env

# Run
cd backend && bash start_server.sh

# Test
curl http://127.0.0.1:8003/health
```

---

## 📚 Documentation by Role

### 🆕 New Team Member
1. Read: [COLLABORATOR_ONBOARDING.md](./COLLABORATOR_ONBOARDING.md)
2. Run: `bash setup.sh`
3. Ask: Team lead for Firebase credentials
4. Start: Using VSCode run button

### 👨‍💻 Active Developer
1. Reference: [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)
2. Start server: `bash backend/start_server.sh`
3. Make changes
4. Test: `curl` or VSCode
5. Commit & push

### 📊 DevOps / Infrastructure
1. Reference: [PERSISTENT_SERVER_SETUP.md](./PERSISTENT_SERVER_SETUP.md)
2. Configure: LaunchAgent
3. Monitor: `tail -f backend/logs/server.log`
4. Maintain: 24/7 operation

### 🎯 Project Lead
1. Overview: [README_MAIN.md](./README_MAIN.md)
2. Share: [COLLABORATOR_ONBOARDING.md](./COLLABORATOR_ONBOARDING.md)
3. Manage: Firebase credentials
4. Review: Pull requests

---

## 🔍 Finding Things Quickly

### "How do I...?"
- **...set up the project?** → [COLLABORATOR_ONBOARDING.md](./COLLABORATOR_ONBOARDING.md)
- **...start developing?** → [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)
- **...fix errors?** → [COLLABORATOR_ONBOARDING.md#troubleshooting](./COLLABORATOR_ONBOARDING.md#-troubleshooting)
- **...use the run button?** → [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)
- **...get help?** → This file + ask team lead

### "What is...?"
- **Architecture?** → [README_MAIN.md](./README_MAIN.md)
- **Folder structure?** → This file
- **API endpoints?** → [README_MAIN.md](./README_MAIN.md#-api-endpoints)
- **Collaboration workflow?** → [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)

---

## ⚙️ Server Management

### Start Server
```bash
cd backend
bash start_server.sh
```

### Stop Server
```bash
pkill -f "python main.py"
```

### View Logs
```bash
tail -f backend/logs/server.log
```

### Test Server
```bash
curl http://127.0.0.1:8003/health
```

---

## 💻 VSCode Setup

1. **Python Extension**: Install "Python" by Microsoft
2. **Run Button**: Press `Ctrl+Shift+D`
3. **Select Config**: Choose "Run DensityX-AI Backend"
4. **Click Play**: Green button to start

---

## 🎯 Daily Workflow

```
Morning:
1. git pull origin main
2. Create feature branch
3. bash backend/start_server.sh

Development:
4. Edit code
5. Test with curl/VSCode
6. Repeat 4-5

Evening:
7. git add .
8. git commit -m "feat: description"
9. git push origin feature/name
10. Create Pull Request
```

---

## 📞 Quick Links

| Need | Location |
|------|----------|
| Setup help | [COLLABORATOR_ONBOARDING.md](./COLLABORATOR_ONBOARDING.md) |
| Development | [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) |
| Project info | [README_MAIN.md](./README_MAIN.md) |
| Commands | [QUICK_START_SERVER.md](./QUICK_START_SERVER.md) |
| Architecture | [README_MAIN.md](./README_MAIN.md) |
| Errors | [COLLABORATOR_ONBOARDING.md#troubleshooting](./COLLABORATOR_ONBOARDING.md#-troubleshooting) |

---

## ✅ Setup Checklist for New Members

- [ ] Clone repository
- [ ] Read COLLABORATOR_ONBOARDING.md
- [ ] Run bash setup.sh
- [ ] Get Firebase credentials from lead
- [ ] Add to backend/.env
- [ ] Start server: bash backend/start_server.sh
- [ ] Test: curl http://127.0.0.1:8003/health
- [ ] Create first feature branch
- [ ] Make a change
- [ ] Create pull request

---

## 🆘 Need Help?

1. **Setup Issues?** → [COLLABORATOR_ONBOARDING.md#troubleshooting](./COLLABORATOR_ONBOARDING.md#-troubleshooting)
2. **Code Question?** → [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)
3. **Server Error?** → Check `backend/logs/server.log`
4. **Don't know what to do?** → Ask team lead

---

## 🎉 Status

✅ Backend ready  
✅ Firebase connected  
✅ 24/7 operation enabled  
✅ Documentation complete  
✅ Ready for collaboration  
✅ VSCode integration ready  

---

**Everything is set up. Pick a document above and get started! 🚀**
