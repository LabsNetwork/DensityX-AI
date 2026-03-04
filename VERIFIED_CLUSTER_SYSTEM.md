# 🔐 Verified-Only Cluster System Implementation

**Status**: ✅ COMPLETE  
**Date**: 1 March 2026  
**Purpose**: Enforce CSV ticket verification for all clustering operations

---

## 📋 Overview

This document outlines the **verified-only cluster system** — a security layer ensuring that:
- ✅ **Only CSV-verified tickets** can contribute GPS data
- ✅ **Only verified user GPS** influences cluster formation  
- ✅ **Surge alerts** are accurate and spam-free
- ✅ **No ghost clusters** from unverified users

---

## 🧩 Components Modified

### 1. **User Model** (`backend/models/user_location.py`)

Added two new fields to track verification status:

```python
class UserLocation(BaseModel):
    ticket_id: str                          # Verified ticket ID from CSV
    name: Optional[str]                     # User name
    phone: Optional[str]                    # User phone
    latitude: float = 0.0                   # GPS latitude
    longitude: float = 0.0                  # GPS longitude
    gps_enabled: bool = False               # GPS tracking status
    verified: bool = False                  # ✅ CSV ticket verified
    gps_allowed: bool = False               # ✅ GPS submission allowed
```

**Fields Explained**:
- `verified`: Set to `True` only if ticket exists in CSV (verified at registration)
- `gps_allowed`: Set to `True` only for verified users (controls GPS storage gate)

---

### 2. **User Registration** (`backend/api/user_routes.py` - `/user/register`)

**Flow**:
1. POST ticket_id, name, phone → endpoint
2. Check `is_valid_ticket(ticket_id)` against CSV
3. If valid:
   - Set `verified = True`
   - Set `gps_allowed = True`
   - Save to Firebase with verification flags
4. If invalid:
   - Return 400 Bad Request

**Code**:
```python
@router.post("/register")
def register_user(registration: UserRegistration):
    # Validate ticket
    if not is_valid_ticket(registration.ticket_id):
        raise HTTPException(status_code=400, detail="Invalid ticket ID")
    
    # Create user with verification flags
    user = UserLocation(
        ticket_id=registration.ticket_id,
        name=registration.name,
        phone=registration.phone,
        verified=True,          # ✅ CSV verified
        gps_allowed=True,       # ✅ Allow GPS
        latitude=0.0,
        longitude=0.0,
        gps_enabled=False
    )
    
    # Save to Firebase with verification metadata
    user_data = {
        "ticket_id": registration.ticket_id,
        "verified": True,       # ✅ Firebase flag
        "gps_allowed": True,    # ✅ Firebase flag
        ...
    }
```

---

### 3. **GPS Capture Gate** (`backend/api/user_routes.py` - `/user/location`)

**🔐 Critical Security Check**:

```python
@router.post("/location")
def update_location(update: UserLocationUpdate):
    user = memory_store.get_user(update.ticket_id)
    
    # 🔐 GPS GATE: Only verified users can submit GPS
    if not user.verified or not user.gps_allowed:
        raise HTTPException(
            status_code=403,
            detail="User not verified. GPS updates rejected."
        )
    
    # Update location (only reaches here if verified)
    updated_user = memory_store.update_user_location(...)
    
    # Save to Firebase with verification metadata
    location_data = {
        ...
        "verified": True,  # ✅ Metadata for audit trail
    }
```

**Response Codes**:
- `200 OK`: Location updated (user verified)
- `403 Forbidden`: GPS rejected (user NOT verified)
- `404 Not Found`: User not registered

---

### 4. **Verified-Only Cluster Data Source** (`backend/storage/memory_store.py`)

**New Function**:
```python
def get_verified_gps_users() -> List[UserLocation]:
    """
    🔐 VERIFIED-ONLY CLUSTER DATA SOURCE
    
    Returns ONLY users where:
    - verified == True
    - gps_enabled == True
    - latitude/longitude != 0.0
    """
    return [
        u for u in _active_users.values() 
        if u.verified and u.gps_enabled and u.latitude != 0.0 and u.longitude != 0.0
    ]
```

**Purpose**: Single source of truth for clustering. All clustering operations MUST use this function.

---

### 5. **Cluster Filtering** (`backend/main.py` - `density_tick()`)

**Before**:
```python
users = memory_store.get_gps_enabled_users()  # ❌ No verification check
```

**After**:
```python
users = memory_store.get_verified_gps_users()  # ✅ Verified-only
```

**Full Function**:
```python
def density_tick() -> None:
    """
    🔐 VERIFIED-ONLY CLUSTERING
    """
    if settings.USE_SIMULATION:
        locations = memory_store.get_locations()
        points = [{"lat": loc.latitude, "lon": loc.longitude} for loc in locations]
        source = "simulated"
    else:
        # ✅ VERIFIED-ONLY: Use get_verified_gps_users()
        users = memory_store.get_verified_gps_users()
        points = [{"lat": u.latitude, "lon": u.longitude} for u in users]
        source = "verified users only"
    
    result = run_dbscan(points, ...)
    memory_store.set_last_density_result(result)
    print(f"[density] {source} clusters={n}")
```

---

### 6. **API Response Filtering** (`backend/api/crowd_routes.py`)

**GET /crowd/locations**:
```python
@router.get("/locations")
def get_crowd_locations():
    if settings.USE_SIMULATION:
        locations = memory_store.get_locations()
        points = [{"lat": loc.latitude, "lon": loc.longitude} for loc in locations]
    else:
        # ✅ VERIFIED-ONLY: Return only verified users
        users = memory_store.get_verified_gps_users()
        points = [{"lat": u.latitude, "lon": u.longitude} for u in users]
    
    db_result = run_dbscan(points, ...)
    return {
        "count": len(points),
        "points": points,
        "clusters": [...],  # ✅ Only from verified users
        "success": True
    }
```

---

## 🔄 Complete User Journey (Verified-Only)

### Step 1: User Registration (Ticket Verification)
```bash
curl -X POST http://127.0.0.1:8003/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "DX-005491",    # Must exist in CSV
    "name": "John Doe",
    "phone": "+91-9876543210"
  }'
```

**Firebase State After Registration**:
```json
{
  "users/DX-005491": {
    "ticket_id": "DX-005491",
    "verified": true,            // ✅ CSV verified
    "gps_allowed": true,         // ✅ Allow GPS
    "latitude": 0.0,
    "longitude": 0.0,
    "gps_enabled": false,
    "registered_at": "2026-03-01T...",
    "last_updated": "2026-03-01T..."
  }
}
```

---

### Step 2: User Enables GPS (GPS Gate Check)
```bash
curl -X POST http://127.0.0.1:8003/user/location \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "DX-005491",
    "latitude": 13.0850,
    "longitude": 80.2101,
    "gps_enabled": true
  }'
```

**Validation at Endpoint**:
1. Check if user exists ✅
2. Check if `user.verified == true` ✅
3. Check if `user.gps_allowed == true` ✅
4. If all true → Store GPS location
5. If any false → Return 403 Forbidden

**Firebase State After GPS Update**:
```json
{
  "users/DX-005491": {
    "ticket_id": "DX-005491",
    "verified": true,
    "gps_allowed": true,
    "latitude": 13.0850,         // ✅ Updated
    "longitude": 80.2101,        // ✅ Updated
    "gps_enabled": true,         // ✅ GPS active
    "registered_at": "2026-03-01T...",
    "last_updated": "2026-03-01T..."
  },
  "locations/DX-005491": {
    "ticket_id": "DX-005491",
    "latitude": 13.0850,
    "longitude": 80.2101,
    "verified": true,            // ✅ Audit trail
    "timestamp": "2026-03-01T..."
  }
}
```

---

### Step 3: Cluster Formation (Verified-Only)

**Every 2 seconds** (DBSCAN_INTERVAL_SECONDS):
1. Call `memory_store.get_verified_gps_users()`
2. Filter returns ONLY users with `verified=true` AND `gps_enabled=true`
3. Extract GPS points from verified users only
4. Run DBSCAN clustering on verified points only
5. Store result in memory
6. Check for surge alerts (only verified clusters)

**Guaranteed Clusters**:
- ✅ Only from CSV-verified tickets
- ✅ Only from users with GPS enabled
- ✅ Only from users with valid coordinates (not 0.0, 0.0)

---

## 🛡️ Security Properties

### 1. **Ticket Verification Enforcement**
- ❌ No unverified users can submit GPS
- ✅ Only CSV-valid tickets proceed
- ✅ Invalid tickets get 400 Bad Request

### 2. **GPS Capture Gate**
- ❌ Unverified users get 403 Forbidden on GPS update
- ✅ Only verified users can update location
- ✅ GPS data is protected by verification status

### 3. **Cluster Isolation**
- ❌ No clusters from unverified users
- ✅ Only verified user GPS contributes
- ✅ All clustering operations use verified-only data

### 4. **Surge Accuracy**
- ❌ No false alerts from spam/noise
- ✅ Surge detection based on verified clusters only
- ✅ Alert thresholds applied to real users

### 5. **Audit Trail**
- ✅ Firebase location entries include `"verified": true`
- ✅ Easy to audit cluster provenance
- ✅ Traceable verification status for each update

---

## 📊 Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                       USER REGISTRATION                       │
├──────────────────────────────────────────────────────────────┤
│  POST /user/register                                          │
│  ├─ Validate ticket against CSV                              │
│  ├─ If invalid → 400 Bad Request ❌                          │
│  └─ If valid → Create user with verified=true ✅             │
│      └─ Save to Firebase with gps_allowed=true               │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                      GPS CAPTURE GATE                         │
├──────────────────────────────────────────────────────────────┤
│  POST /user/location                                          │
│  ├─ Check user exists                                        │
│  ├─ Check user.verified == true                              │
│  ├─ Check user.gps_allowed == true                           │
│  ├─ If any false → 403 Forbidden ❌                          │
│  └─ If all true → Store GPS to Firebase ✅                   │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                  VERIFIED-ONLY DATA SOURCE                    │
├──────────────────────────────────────────────────────────────┤
│  memory_store.get_verified_gps_users()                        │
│  ├─ Filter: verified == true ✅                              │
│  ├─ Filter: gps_enabled == true ✅                           │
│  ├─ Filter: lat/lon != 0.0 ✅                                │
│  └─ Return: List[UserLocation] (verified only)               │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                   CLUSTER FORMATION                           │
├──────────────────────────────────────────────────────────────┤
│  density_tick() → get_verified_gps_users()                   │
│  ├─ Extract GPS points from verified users                   │
│  ├─ Run DBSCAN on verified points only                       │
│  ├─ Compute cluster sizes (verified only)                    │
│  └─ Check surge alerts (verified clusters only)              │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                    MAP & API RESPONSE                         │
├──────────────────────────────────────────────────────────────┤
│  GET /crowd/locations                                         │
│  ├─ Use get_verified_gps_users()                             │
│  ├─ Return verified clusters only                            │
│  ├─ Return verified GPS points only                          │
│  └─ Response: {points[], clusters[], count}                  │
│                                                               │
│  Frontend displays:                                           │
│  ├─ ✅ Blue dots (verified users)                            │
│  ├─ ✅ Orange circles (safe verified clusters)               │
│  ├─ ✅ Red circles (risky verified clusters)                 │
│  └─ ❌ No ghost clusters / unverified noise                  │
└──────────────────────────────────────────────────────────────┘
```

---

## 🧪 Testing the Verified-Only System

### Test 1: Invalid Ticket Registration
```bash
curl -X POST http://127.0.0.1:8003/user/register \
  -H "Content-Type: application/json" \
  -d '{"ticket_id":"INVALID","name":"Test","phone":"9999"}'

# Expected: 400 Bad Request
# Detail: "Invalid ticket ID: INVALID"
```

### Test 2: Valid Ticket Registration
```bash
curl -X POST http://127.0.0.1:8003/user/register \
  -H "Content-Type: application/json" \
  -d '{"ticket_id":"DX-005491","name":"Test","phone":"9999"}'

# Expected: 201 Created
# User created with verified=true, gps_allowed=true
```

### Test 3: GPS Update (Unverified User) - Should Fail
**Note**: Create an unverified user manually (set verified=false in Firebase), then try GPS update:
```bash
curl -X POST http://127.0.0.1:8003/user/location \
  -H "Content-Type: application/json" \
  -d '{"ticket_id":"UNVERIFIED","latitude":13.0,"longitude":80.2,"gps_enabled":true}'

# Expected: 403 Forbidden
# Detail: "User UNVERIFIED is not verified. GPS updates rejected."
```

### Test 4: GPS Update (Verified User) - Should Succeed
```bash
curl -X POST http://127.0.0.1:8003/user/location \
  -H "Content-Type: application/json" \
  -d '{"ticket_id":"DX-005491","latitude":13.0850,"longitude":80.2101,"gps_enabled":true}'

# Expected: 200 OK
# Location updated and saved to Firebase
```

### Test 5: Cluster Accuracy - Only Verified Users
```bash
curl -s http://127.0.0.1:8003/crowd/locations | jq '.clusters | length'

# Expected: Only clusters from verified users
# If 0 verified users with GPS: 0 clusters
# If N verified users with GPS: computed clusters from N points only
```

---

## 📝 Code References

| Component | File | Function | Change |
|-----------|------|----------|--------|
| User Model | `models/user_location.py` | `UserLocation` | Added `verified`, `gps_allowed` fields |
| Registration | `api/user_routes.py` | `register_user()` | Set `verified=true` on CSV match |
| GPS Gate | `api/user_routes.py` | `update_location()` | Check `verified` before storing GPS |
| Data Source | `storage/memory_store.py` | `get_verified_gps_users()` | ✅ NEW: Verified-only filter |
| Clustering | `backend/main.py` | `density_tick()` | Use `get_verified_gps_users()` |
| API Response | `api/crowd_routes.py` | `get_crowd_locations()` | Use `get_verified_gps_users()` |

---

## ✅ Backward Compatibility

- ✅ Existing CSV ticket structure unchanged
- ✅ Firebase schema extended (new fields, no breaking changes)
- ✅ API responses maintain same structure
- ✅ Simulation mode still works (uses simulated points, not real users)
- ✅ Existing integrations continue to work

---

## 🚀 Next Steps (Optional)

1. **Real-Time Validation**: Add periodic re-validation of ticket status
2. **Revocation**: Implement ticket revocation endpoint (set `verified=false`)
3. **Audit Logging**: Log all GPS updates with verification metadata
4. **Metrics Dashboard**: Display % verified vs unverified submissions
5. **Compliance Reports**: Generate reports of verified-only clusters

---

## 📞 Support

For questions about this implementation:
- Check `backend/api/user_routes.py` for registration/GPS gates
- Check `backend/storage/memory_store.py` for `get_verified_gps_users()`
- Check `backend/main.py` `density_tick()` for cluster filtering
- Review this document for security properties

**All clustering is now verified-only. No unverified user data influences clusters.** ✅
