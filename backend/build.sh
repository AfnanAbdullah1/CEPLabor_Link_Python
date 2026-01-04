#!/usr/bin/env bash
# Render build script for LaborLink backend

set -o errexit  # Exit on error

echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Running database migrations..."
python migrate_database.py

echo "Build completed successfully!"
