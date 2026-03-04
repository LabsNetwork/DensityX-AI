# 🛠️ Development Guide for Collaborators

This guide provides detailed information for developing and maintaining DensityX-AI with your team.

---

## 🚀 Your First Day Setup

### Step 1: Clone and Initial Setup (10 minutes)
```bash
# 1. Clone repository
git clone https://github.com/your-org/DensityX-AI.git
cd DensityX-AI

# 2. Run setup script (installs everything)
bash setup.sh

# 3. Add Firebase credentials
nano backend/.env
# Ask team lead for credentials
```

### Step 2: Start Development Server (5 minutes)
```bash
# Option A: VSCode (Recommended)
Press Ctrl+Shift+D → Select "Run DensityX-AI Backend" → Click Play

# Option B: Terminal
cd backend
bash start_server.sh

# Verify it works
curl http://127.0.0.1:8003/health
```

### Step 3: Make Your First Change
```bash
# Create a new branch
git checkout -b feature/your-first-feature

# Edit a file in backend/ or frontend/

# Test your changes
bash backend/start_server.sh

# Commit and push
git add .
git commit -m "feat: your change description"
git push origin feature/your-first-feature

# Create Pull Request on GitHub
```

✅ **You're now contributing!**

---

## 📁 Where to Make Changes

### Backend Development

#### Location: `backend/`

**API Routes** (`backend/api/`)
- `user_routes.py` - User registration, location tracking
- `density_routes.py` - Density analysis endpoints
- `crowd_routes.py` - Crowd data endpoints
- `location_routes.py` - Location endpoints

**Business Logic** (`backend/services/`)
- `ticket_validator.py` - Validate user tickets
- Add new services here

**Data Models** (`backend/models/`)
- `user_location.py` - User location data model
- `location.py` - Location model
- Add new models here

**Database** (`backend/storage/`)
- `memory_store.py` - In-memory database
- `firebase_config.py` - Firebase integration

**Main Entry Point**
- `main.py` - FastAPI app setup, routes registration

#### Making API Changes
```python
# Example: Adding new endpoint in backend/api/

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/new", tags=["new"])

class NewData(BaseModel):
    name: str
    value: int

@router.post("/endpoint")
async def create_new(data: NewData):
    """Create a new resource"""
    return {"status": "created", "data": data}

# Add to main.py:
# from api.new_routes import router as new_router
# app.include_router(new_router)
```

### Frontend Development

#### Location: `frontend/`

**Components** (`frontend/src/`)
- `App.jsx` - Main component
- `components/` - Create new components here
- `pages/` - Page components

**Styles** (`frontend/src/`)
- `App.css` - Global styles
- `index.css` - Default styles

#### Making UI Changes
```jsx
// Example: Creating new component in frontend/src/components/

import React, { useState, useEffect } from 'react';

export function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch from backend
    fetch('http://127.0.0.1:8003/api/endpoint')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return (
    <div>
      {data ? <p>{data.name}</p> : <p>Loading...</p>}
    </div>
  );
}
```

---

## 🔄 Development Workflow

### Daily Workflow

```bash
# 1. Start your day - pull latest changes
git pull origin main

# 2. Create feature branch
git checkout -b feature/daily-task

# 3. Make changes to backend or frontend

# 4. Test your changes
cd backend && bash start_server.sh
cd frontend && npm run dev

# 5. Commit frequently with clear messages
git add .
git commit -m "feat: specific change"

# 6. Push your changes
git push origin feature/daily-task

# 7. Create/update Pull Request on GitHub
```

### Commit Message Format

Use Conventional Commits:
```
feat: add new feature
fix: fix a bug  
docs: update documentation
refactor: improve code structure
test: add tests
chore: update dependencies
perf: improve performance
style: fix formatting
ci: CI/CD changes
```

**Examples:**
```
feat: add user location API endpoint
fix: correct Firebase connection timeout
docs: update installation instructions
refactor: simplify density calculation
test: add tests for user registration
```

### Code Review Checklist

Before submitting PR:
- [ ] Code tested locally
- [ ] No console errors/warnings
- [ ] Follow code style (Black for Python, Prettier for JS)
- [ ] No hardcoded secrets
- [ ] Documentation updated if needed
- [ ] .gitignore respected
- [ ] Descriptive commit messages

---

## 🧪 Testing Your Code

### Backend Testing

```bash
# Unit tests
cd backend
source venv/bin/activate
python -m pytest tests/

# Manual API testing with curl
curl -X POST http://127.0.0.1:8003/user/register \
  -H "Content-Type: application/json" \
  -d '{"ticket_id":"DX-005491","name":"Test","phone":"9999999999"}'

# Check server health
curl http://127.0.0.1:8003/health
```

### Frontend Testing

```bash
# Development server (hot reload)
cd frontend
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### API Testing Tools

**Option 1: cURL (Terminal)**
```bash
curl -X GET http://127.0.0.1:8003/health
curl -X POST http://127.0.0.1:8003/user/register -d '{...}'
```

**Option 2: VSCode REST Client**
- Install "REST Client" extension
- Create `requests.http` file:
```http
### Get health
GET http://127.0.0.1:8003/health

### Register user
POST http://127.0.0.1:8003/user/register
Content-Type: application/json

{
  "ticket_id": "DX-005491",
  "name": "Test User",
  "phone": "9999999999"
}
```

**Option 3: Thunder Client / Postman**
- GUI tools for API testing
- Easy to use for complex requests

---

## 🐛 Debugging

### View Server Logs
```bash
# Real-time logs
tail -f backend/logs/server.log

# Error logs
tail -f backend/logs/server_error.log

# Search logs
grep "error" backend/logs/server.log
grep "firebase" backend/logs/server.log
```

### Common Issues

#### Issue: "ModuleNotFoundError"
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

#### Issue: "Port 8003 already in use"
```bash
pkill -f "python main.py"
sleep 2
bash start_server.sh
```

#### Issue: "Firebase not connected"
- Check `.env` file has credentials
- Check credentials are valid JSON
- View logs: `tail -f backend/logs/server.log`

#### Issue: "Connection refused"
```bash
# Use 127.0.0.1 instead of localhost
curl http://127.0.0.1:8003/health

# Check if port is open
lsof -i :8003
```

### VSCode Debugging

1. **Set Breakpoints**: Click line number
2. **Start Debugger**: Press F5 or Ctrl+Shift+D
3. **Run Configuration**: Select "Run DensityX-AI Backend"
4. **Step Through**: F10 (step over), F11 (step into)
5. **Inspect Variables**: Hover over or use Watch pane

---

## 📦 Dependencies

### Backend Dependencies (`backend/requirements.txt`)
```
fastapi           # Web framework
uvicorn           # ASGI server
firebase-admin    # Firebase SDK
python-dotenv     # Environment variables
scikit-learn      # ML/clustering
numpy             # Numerical computing
```

Add new dependency:
```bash
cd backend
source venv/bin/activate
pip install new-package
pip freeze > requirements.txt
```

### Frontend Dependencies (`frontend/package.json`)
```
react            # UI framework
vite             # Build tool
axios            # HTTP client
```

Add new dependency:
```bash
cd frontend
npm install new-package
```

---

## 🔐 Secrets & Configuration

### Environment Variables
Located in `backend/.env`:
```
FIREBASE_CREDENTIALS_JSON='{"type":"service_account",...}'
FIREBASE_DATABASE_URL='https://your-project.firebaseio.com'
FIREBASE_STORAGE_BUCKET='your-project.appspot.com'
```

**Never commit .env file!** It's in `.gitignore`

### Getting Secrets
```bash
# Ask team lead for .env contents
# DO NOT share via email or messaging
# Use secure channels only

# Create your own .env
cp backend/.env.example backend/.env
# Add your credentials
```

---

## 🚀 Deployment

### Local Development
```bash
bash backend/start_server.sh
cd frontend && npm run dev
```

### Testing (Staging)
```bash
# Build frontend
cd frontend
npm run build

# Backend already running
```

### Production
- Covered in separate deployment guide
- Requires environment setup
- Ask team lead for deployment access

---

## 📞 Common Commands

### Git Commands
```bash
git status                    # Check status
git diff                      # See changes
git log --oneline            # View history
git checkout -b feature/name # Create branch
git add .                    # Stage changes
git commit -m "msg"          # Commit
git push                     # Push
git pull                     # Pull latest
```

### Backend Commands
```bash
cd backend
source venv/bin/activate     # Activate venv
pip install -r requirements.txt  # Install deps
python main.py              # Run server
bash start_server.sh         # Run with script
```

### Frontend Commands
```bash
cd frontend
npm install                  # Install dependencies
npm run dev                  # Start dev server
npm run build                # Build for production
npm run preview              # Preview build
```

### Debugging Commands
```bash
tail -f backend/logs/server.log    # View logs
ps aux | grep python               # Find processes
lsof -i :8003                      # Check port
curl http://127.0.0.1:8003/health # Test server
```

---

## ✨ VSCode Setup

### Extensions to Install
- Python (Microsoft)
- Pylance (Microsoft)
- REST Client
- Thunder Client
- Prettier
- ESLint

### Keyboard Shortcuts
- `Ctrl+Shift+D` - Run & Debug
- `Ctrl+\`` - Toggle terminal
- `Ctrl+K Ctrl+F` - Format document
- `F5` - Start debugging
- `F10` - Step over
- `F11` - Step into

### Recommended Settings
Already configured in `.vscode/settings.json`:
- Python interpreter: `backend/venv/bin/python`
- Format on save: Enabled
- Exclude patterns: `venv/`, `node_modules/`

---

## 🎯 Code Style

### Python (Backend)
- Use Black for formatting (auto)
- Follow PEP 8
- Type hints for functions
- Docstrings for modules/classes

### JavaScript (Frontend)
- Use Prettier (auto)
- ESLint for linting
- React best practices
- Comments for complex logic

---

## 📚 Learning Resources

### Backend
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Python Docs](https://docs.python.org/3/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

### Frontend
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Axios Docs](https://axios-http.com/)

### Tools
- [Git Docs](https://git-scm.com/doc)
- [GitHub Docs](https://docs.github.com/)
- [VSCode Docs](https://code.visualstudio.com/docs)

---

## 🤝 Collaboration Tips

1. **Communicate Early**: Tell team about your changes
2. **Small PRs**: Easier to review
3. **Clear Messages**: Commit messages should explain "why"
4. **Ask Questions**: Don't be shy
5. **Review Others**: Help review PRs
6. **Test Thoroughly**: Before submitting PR
7. **Document Changes**: Update README if needed

---

## 🎓 First Contribution Checklist

- [ ] Clone repository
- [ ] Run `bash setup.sh`
- [ ] Add Firebase credentials to `.env`
- [ ] Start server: `bash backend/start_server.sh`
- [ ] Test: `curl http://127.0.0.1:8003/health`
- [ ] Create feature branch
- [ ] Make a small change
- [ ] Test your change
- [ ] Commit and push
- [ ] Create Pull Request
- [ ] Get reviewed and merge

---

**Happy developing! If you have questions, ask your team lead. 🚀**
