FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY Backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY Backend/ ./Backend/

# Expose Flask/Gunicorn port
EXPOSE 5000

# Run with Gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:5000", "Backend.main:app"]
