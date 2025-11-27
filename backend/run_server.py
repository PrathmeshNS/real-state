#!/usr/bin/env python
"""
Production-ready Django server runner for Render deployment.
This handles proper port binding and static file collection.
"""
import os
import sys
import subprocess

def main():
    """Run production setup and start server."""
    
    # Set Django settings module
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'realestate.settings')
    
    # Get port from environment (Render provides this)
    port = os.environ.get('PORT', '8000')
    
    print(f"[INFO] Starting Django server on port {port}")
    
    try:
        # Collect static files (important for production)
        print("[INFO] Collecting static files...")
        subprocess.run([sys.executable, 'manage.py', 'collectstatic', '--noinput'], check=True)
        
        # Apply database migrations
        print("[INFO] Applying database migrations...")
        subprocess.run([sys.executable, 'manage.py', 'migrate'], check=True)
        
        # Start the server with proper binding
        print(f"[INFO] Starting server on 0.0.0.0:{port}")
        subprocess.run([
            sys.executable, 'manage.py', 'runserver', 
            f'0.0.0.0:{port}'
        ], check=True)
        
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] Command failed: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("[INFO] Server stopped by user")
        sys.exit(0)

if __name__ == '__main__':
    main()