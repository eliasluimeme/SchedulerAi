# Backend Dockerfile
FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Expose port
EXPOSE 8000

# Command to run the app
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"] 