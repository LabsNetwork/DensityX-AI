# backend/firebase_config.py
# Firebase Admin SDK initialization and configuration

import os
import json
from pathlib import Path
import firebase_admin
from firebase_admin import credentials, auth, db, storage

class FirebaseConfig:
    """Firebase configuration and initialization."""
    
    _initialized = False
    
    @classmethod
    def initialize(cls):
        """Initialize Firebase Admin SDK with credentials from environment."""
        if cls._initialized:
            return
        
        try:
            # Try to load credentials from FIREBASE_CREDENTIALS_JSON env variable
            credentials_json = os.getenv("FIREBASE_CREDENTIALS_JSON")
            
            if credentials_json:
                # Parse JSON string from environment variable
                credentials_dict = json.loads(credentials_json)
                cred = credentials.Certificate(credentials_dict)
            else:
                # Try to load from file path
                cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase-credentials.json")
                if Path(cred_path).exists():
                    cred = credentials.Certificate(cred_path)
                else:
                    raise FileNotFoundError(
                        f"Firebase credentials not found. Set FIREBASE_CREDENTIALS_JSON "
                        f"environment variable or place credentials at {cred_path}"
                    )
            
            # Initialize Firebase Admin SDK
            firebase_admin.initialize_app(cred, {
                'databaseURL': os.getenv("FIREBASE_DATABASE_URL", ""),
                'storageBucket': os.getenv("FIREBASE_STORAGE_BUCKET", ""),
            })
            
            cls._initialized = True
            print("[firebase] Firebase Admin SDK initialized successfully")
            
        except Exception as e:
            print(f"[firebase-error] Failed to initialize Firebase: {e}")
            raise
    
    @classmethod
    def get_auth(cls):
        """Get Firebase Auth instance."""
        if not cls._initialized:
            cls.initialize()
        return auth
    
    @classmethod
    def get_db(cls):
        """Get Firebase Realtime Database instance."""
        if not cls._initialized:
            cls.initialize()
        return db
    
    @classmethod
    def get_storage(cls):
        """Get Firebase Storage instance."""
        if not cls._initialized:
            cls.initialize()
        return storage


def verify_firebase_token(token: str):
    """Verify Firebase ID token and return user info."""
    try:
        firebase_auth = FirebaseConfig.get_auth()
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        print(f"[firebase-error] Token verification failed: {e}")
        return None


def create_firebase_user(email: str, password: str, display_name: str = None):
    """Create a new user in Firebase Authentication."""
    try:
        firebase_auth = FirebaseConfig.get_auth()
        user = firebase_auth.create_user(
            email=email,
            password=password,
            display_name=display_name,
        )
        return user
    except Exception as e:
        print(f"[firebase-error] User creation failed: {e}")
        return None


def get_firebase_user(uid: str):
    """Get user information from Firebase by UID."""
    try:
        firebase_auth = FirebaseConfig.get_auth()
        user = firebase_auth.get_user(uid)
        return user
    except Exception as e:
        print(f"[firebase-error] Failed to get user: {e}")
        return None


def save_user_to_database(uid: str, user_data: dict):
    """Save user data to Firebase Realtime Database."""
    try:
        firebase_db = FirebaseConfig.get_db()
        ref = firebase_db.reference(f"users/{uid}")
        ref.set(user_data)
        print(f"[firebase] User {uid} saved to database")
        return True
    except Exception as e:
        print(f"[firebase-error] Failed to save user to database: {e}")
        return False


def get_user_from_database(uid: str):
    """Get user data from Firebase Realtime Database."""
    try:
        firebase_db = FirebaseConfig.get_db()
        ref = firebase_db.reference(f"users/{uid}")
        data = ref.get().val() if ref.get() else None
        return data
    except Exception as e:
        print(f"[firebase-error] Failed to get user from database: {e}")
        return None


def save_location_to_database(uid: str, location_data: dict):
    """Save user location to Firebase Realtime Database."""
    try:
        firebase_db = FirebaseConfig.get_db()
        ref = firebase_db.reference(f"locations/{uid}")
        ref.set(location_data)
        return True
    except Exception as e:
        print(f"[firebase-error] Failed to save location: {e}")
        return False


def save_density_alert_to_database(alert_data: dict):
    """Save density alert to Firebase Realtime Database."""
    try:
        firebase_db = FirebaseConfig.get_db()
        ref = firebase_db.reference("alerts").push()
        ref.set(alert_data)
        return True
    except Exception as e:
        print(f"[firebase-error] Failed to save alert: {e}")
        return False
