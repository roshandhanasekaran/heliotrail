# PV DPP Validator — Based on CIRPASS-2 dppvalidator architecture
# https://github.com/artiso-ai/dppvalidator
#
# This Dockerfile sets up a PV-specific DPP validation service
# with JSON Schema validation and PV business rules.

FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
