# 🚀 DensityX-AI 24/7 Persistent Server Setup

## ✅ What's Done

Your backend server is now configured to run **24/7 automatically** on macOS without manual intervention.

### System Components

| Component | Status | Details |
|-----------|--------|---------|
| **Server Process** | ✅ Running | PID 80843 on port 8003 |
| **Firebase** | ✅ Connected | Real-time database syncing |
| **LaunchAgent** | ✅ Active | Auto-starts at login |
| **Logs** | ✅ Recording | `backend/logs/` directory |
| **HTTP Access** | ✅ Ready | `http://127.0.0.1:8003` |

---

## 🔧 How It Works

### LaunchAgent (macOS Native)
- **Service**: `com.densityxai.server`
- **Auto-Start**: Runs when you log in
- **Auto-Restart**: Restarts if server crashes
- **Persistent**: Keeps running even if process dies

### Startup Script
- **Location**: `backend/start_server.sh`
- **Purpose**: Reliable server startup with error handling
- **Features**: Dependency checking, port cleanup, health verification

---

## 📝 Setup Instructions

### Step 1: Verify Installation ✅
The setup is **already complete**. Verify it's working:

```bash
# Check server status
ps aux | grep "[p]ython main.py"

# Test API
curl http://127.0.0.1:8003/health

# Check logs
tail -f /Users/pratyush/git/DensityX-AI/backend/logs/server.log
```

### Step 2: Start Server Manually (Optional)
If you need to start the server manually:

```bash
cd /Users/pratyush/git/DensityX-AI/backend
bash start_server.sh
```

### Step 3: Manage LaunchAgent

**Load** (enable auto-start):
```bash
launchctl load ~/Library/LaunchAgents/com.densityxai.server.plist
```

**Unload** (disable auto-start):
```bash
launchctl unload ~/Library/LaunchAgents/com.densityxai.server.plist
```

**Restart**:
```bash
launchctl unload ~/Library/LaunchAgents/com.densityxai.server.plist
sleep 2
launchctl load ~/Library/LaunchAgents/com.densityxai.server.plist
```

**Check Status**:
```bash
launchctl list | grep densityxai
```

---

## 🌐 Access Your Server

### Local Machine
- **Health Check**: `http://127.0.0.1:8003/health`
- **User Register**: `http://127.0.0.1:8003/user/register`
- **Location Update**: `http://127.0.0.1:8003/user/location`

### API Examples

**Register User**:
```bash
curl -X POST http://127.0.0.1:8003/user/register \
  -H "Content-Type: application/json" \
  -d '{"ticket_id":"DX-005491","name":"User Name","phone":"9999999999"}'
```

**Update Location**:
```bash
curl -X POST http://127.0.0.1:8003/user/location \
  -H "Content-Type: application/json" \
  -d '{"ticket_id":"DX-005491","latitude":13.0850,"longitude":80.2101,"gps_enabled":true}'
```

---

## 📊 Monitoring

### View Real-time Logs
```bash
# Server output
tail -f /Users/pratyush/git/DensityX-AI/backend/logs/server.log

# Server errors
tail -f /Users/pratyush/git/DensityX-AI/backend/logs/server_error.log

# Both (combined)
tail -f /Users/pratyush/git/DensityX-AI/backend/logs/*.log
```

### Check Port Status
```bash
lsof -i :8003
```

### Process Information
```bash
ps aux | grep python | grep main.py
```

---

## 🔍 Troubleshooting

### Issue: "Connection refused"

**Solution**: Force IPv4 (not IPv6):
```bash
curl http://127.0.0.1:8003/health

# Instead of:
curl http://localhost:8003/health
```

### Issue: "Address already in use"

**Solution**: Kill and restart
```bash
pkill -f "python main.py"
sleep 2
bash /Users/pratyush/git/DensityX-AI/backend/start_server.sh
```

### Issue: LaunchAgent not starting

**Solution**: Reload it
```bash
launchctl unload ~/Library/LaunchAgents/com.densityxai.server.plist
sleep 2
launchctl load ~/Library/LaunchAgents/com.densityxai.server.plist
```

### Issue: "Firebase not connected"

**Solution**: Check .env file
```bash
cat /Users/pratyush/git/DensityX-AI/backend/.env | grep FIREBASE
```

### View Error Logs
```bash
cat /Users/pratyush/git/DensityX-AI/backend/logs/server_error.log
```

---

## 🎯 Server Features

✅ **Auto-Start**: Server starts when Mac boots  
✅ **Auto-Restart**: Restarts if it crashes  
✅ **Persistent**: Keeps running 24/7  
✅ **Firebase Synced**: All data saved to Firebase  
✅ **Health Check**: Monitor server status anytime  
✅ **Logging**: Full logs for debugging  
✅ **No Manual Intervention**: Set and forget  

---

## 📋 File Locations

```
/Users/pratyush/git/DensityX-AI/
├── backend/
│   ├── main.py                          # Server entry point
│   ├── firebase_config.py               # Firebase module
│   ├── start_server.sh                  # Startup script
│   ├── requirements.txt                 # Dependencies
│   ├── .env                             # Firebase credentials
│   ├── venv/                            # Virtual environment
│   └── logs/
│       ├── server.log                   # Server logs
│       └── server_error.log             # Error logs
│
└── ~/Library/LaunchAgents/
    └── com.densityxai.server.plist      # LaunchAgent config
```

---

## ✨ Next Steps

1. **Your server is now running 24/7** ✅
2. **Test API endpoints** using examples above
3. **Monitor logs** to verify Firebase syncing
4. **Scale up** when ready (add more features, connect frontend)

---

## 🆘 Quick Reference

| Command | Purpose |
|---------|---------|
| `tail -f logs/server.log` | View live logs |
| `curl http://127.0.0.1:8003/health` | Test server |
| `lsof -i :8003` | Check port |
| `bash start_server.sh` | Restart manually |
| `launchctl list \| grep densityxai` | Check LaunchAgent |
| `pkill -f "python main.py"` | Stop server |

---

**🎉 Your DensityX-AI backend is now production-ready with 24/7 persistent operation!**
