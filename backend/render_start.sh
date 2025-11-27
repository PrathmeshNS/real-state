#!/bin/bash

# Render.com startup script for Django application
# This script should be used as the "Start Command" in Render

# Change to backend directory if not already there
cd /opt/render/project/src/backend || cd backend || echo "Already in correct directory"

echo "[INFO] Collecting static files..."
python manage.py collectstatic --noinput

echo "[INFO] Running database migrations..."
python manage.py migrate --noinput

echo "[INFO] Starting Django server on 0.0.0.0:$PORT"
python manage.py runserver 0.0.0.0:$PORT