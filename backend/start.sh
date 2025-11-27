#!/bin/bash

# Collect static files
python manage.py collectstatic --noinput

# Apply database migrations
python manage.py migrate

# Start the Django server
python manage.py runserver 0.0.0.0:$PORT