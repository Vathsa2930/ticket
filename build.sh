#!/usr/bin/env bash

# Build React frontend
cd frontend
npm install
npm run build

# Back to Django
cd ..
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate
