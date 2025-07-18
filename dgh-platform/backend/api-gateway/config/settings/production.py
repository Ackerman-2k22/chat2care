from .base import *
from decouple import config

# Database
DATABASES = {
    'default': config('DATABASE_URL', cast=db_url)
}

# Static files avec WhiteNoise
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'apps.gateway.middleware.ServiceRoutingMiddleware',
    'apps.gateway.middleware.RequestTracingMiddleware',
]

# Security
DEBUG = False
SECRET_KEY = config('DJANGO_SECRET_KEY', default=SECRET_KEY)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='*', cast=lambda v: [s.strip() for s in v.split(',')])