FROM python:3.12-slim

WORKDIR /app

# Install system dependencies if needed (e.g. for some python packages)
# gulagcleaner binary wheel should be self-contained for manylinux
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY app ./app

# Expose the port
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "app.backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
