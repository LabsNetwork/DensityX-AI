# 🚀 Quick Start - DensityX-AI 24/7 Server

## Your Server is Running Now! ✅

```bash
# Test it's working
curl http://127.0.0.1:8003/health
```

Expected response:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2026-03-01T17:08:32.168433"
}
```

---

## Most Important Commands

### Start Server (if not running)
```bash
cd /Users/pratyush/git/DensityX-AI/backend
bash start_server.sh
```

### Stop Server
```bash
pkill -f "python main.py"
```

### View Live Logs
```bash
tail -f /Users/pratyush/git/DensityX-AI/backend/logs/server.log
```

### Test API
```bash
# Register user
curl -X POST http://127.0.0.1:8003/user/register \
  -H "Content-Type: application/json" \
  -d '{"ticket_id":"DX-005491","name":"Test","phone":"9999999999"}'

# Update location  
curl -X POST http://127.0.0.1:8003/user/location \
  -H "Content-Type: application/json" \
  -d '{"ticket_id":"DX-005491","latitude":13.0850,"longitude":80.2101,"gps_enabled":true}'
```

---

## Why Localhost Not Found? ✅ FIXED

**Problem**: Using `http://localhost:8003` sometimes fails  
**Reason**: macOS IPv6 preference issue  
**Solution**: Use `http://127.0.0.1:8003` instead ✅

This is now your **permanent fix**!

---

## Auto-Start Setup

Your server now:
- ✅ Starts automatically when Mac boots
- ✅ Restarts if it crashes
- ✅ Runs 24/7 without intervention
- ✅ Firebase syncs all data

**Nothing to do** - it's already set up!

---

## Configuration Files

- **Server Config**: `/Users/pratyush/git/DensityX-AI/backend/.env`
- **LaunchAgent**: `/Users/pratyush/Library/LaunchAgents/com.densityxai.server.plist`
- **Logs**: `/Users/pratyush/git/DensityX-AI/backend/logs/`

---

## Key Features

| Feature | Status |
|---------|--------|
| Server Running | ✅ Yes |
| Firebase Connected | ✅ Yes |
| Auto-Restart on Crash | ✅ Yes |
| 24/7 Operation | ✅ Yes |
| Free (No Cloud Costs) | ✅ Yes |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Connection refused | Use `127.0.0.1` not `localhost` |
| Port in use | `pkill -f "python main.py"` |
| Server not starting | `bash start_server.sh` |
| Check logs | `tail -f logs/server.log` |

---

**That's it! Your server is ready to use 24/7.** 🎉
