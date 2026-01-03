FROM python:3.10-slim-bullseye

WORKDIR /app

# update package
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        libopencv-dev \
        python3-opencv \
        libgl1 \
        libglib2.0-0 \
        libsm6 \
        libxrender1 \
        libxext6 \
        pkg-config && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy file requirements vào container
COPY ../requirements/requirements.txt /app/requirements.txt

# install package 
RUN pip install --no-cache-dir -r requirements.txt

# Copy code
COPY ../ /app

EXPOSE 8000