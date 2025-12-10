#!/bin/bash
echo "Starting Gulag Cleaner Web App..."

# Navigate to the project directory
cd "$(dirname "$0")"

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Install requirements if needed (rudimentary check)
if ! pip freeze | grep -q "fastapi"; then
    echo "Installing dependencies..."
    pip install -r requirements.txt
fi

# Run the server
echo "Server running at http://localhost:8000"
python -m uvicorn app.backend.main:app --host 0.0.0.0 --port 8000 --reload
