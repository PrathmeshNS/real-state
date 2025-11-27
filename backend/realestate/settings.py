# backend/realestate/settings.py
from pathlib import Path
import os
from urllib.parse import urlparse

from dotenv import load_dotenv
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-wg+4836u$@mrh3!r_k*!$nloux%kx+z8jkm^t8k+w4-sd38mhx')

DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'

# Helper: sanitize hosts from environment vars or input strings
def _sanitize_host(host_str: str) -> str:
    s = host_str.strip()
    # If it's a URL like https://example.com/path, extract netloc
    parsed = urlparse(s)
    if parsed.netloc:
        return parsed.netloc
    # Otherwise, remove any scheme/leading/trailing slashes
    return s.replace('http://', '').replace('https://', '').rstrip('/').split('/')[0]

# Default hosts (no scheme, no path)
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    'real-state-1-80ov.onrender.com',
    'real-state-h237.onrender.com',
    '.onrender.com',  # wildcard subdomains for Render
]

# Add any additional hosts from environment variable
if os.getenv('ALLOWED_HOSTS'):
    extra_hosts = [h for h in os.getenv('ALLOWED_HOSTS').split(',') if h.strip()]
    ALLOWED_HOSTS.extend([_sanitize_host(h) for h in extra_hosts])

print('[INFO] Final ALLOWED_HOSTS:', ALLOWED_HOSTS)


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # For static files in production
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# CORS settings
CORS_ALLOW_ALL_ORIGINS = DEBUG  # Only allow all origins in development

if not DEBUG:
    # In production, specify allowed origins.
    # Allow origins by default for Render subdomains. These should be scheme+host
    # and must NOT include a path or trailing slash.
    DEFAULT_CORS_ORIGINS = [
        'https://real-state-h237.onrender.com',
    ]

    # Helper to sanitize origins: ensure scheme & netloc only (drop path)
    def _sanitize_origin(o: str) -> str:
        s = o.strip()
        parsed = urlparse(s)
        if parsed.scheme and parsed.netloc:
            return f"{parsed.scheme}://{parsed.netloc}"
        # if only netloc or naked host provided, default to https
        if parsed.path and not parsed.scheme and not parsed.netloc:
            # path contains 'example.com' (no scheme was provided); treat as host
            host = parsed.path.split('/')[0]
            return f"https://{host}"
        # Fallback: return the original trimmed string
        return s.rstrip('/')

    CORS_ALLOWED_ORIGINS = [
        _sanitize_origin(o) for o in DEFAULT_CORS_ORIGINS
    ]

    # Allow override via env var CORS_ALLOWED_ORIGINS (comma-separated)
    if os.getenv('CORS_ALLOWED_ORIGINS'):
        env_origins = [o.strip() for o in os.getenv('CORS_ALLOWED_ORIGINS').split(',') if o.strip()]
        CORS_ALLOWED_ORIGINS = [ _sanitize_origin(o) for o in env_origins ]
    print('[INFO] CORS_ALLOWED_ORIGINS:', CORS_ALLOWED_ORIGINS)
    
    # Allow specific headers and methods
    CORS_ALLOW_HEADERS = [
        'accept',
        'accept-encoding',
        'authorization',
        'content-type',
        'dnt',
        'origin',
        'user-agent',
        'x-csrftoken',
        'x-requested-with',
    ]

ROOT_URLCONF = 'realestate.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'realestate.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# WhiteNoise configuration
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Security settings for production
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_HSTS_SECONDS = 31536000  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_BROWSER_XSS_FILTER = True
    X_FRAME_OPTIONS = 'DENY'

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Port configuration for production
PORT = os.getenv('PORT', '8000')
