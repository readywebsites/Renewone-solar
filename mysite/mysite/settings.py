from pathlib import Path

import os
import sys

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BASE_DIR.parent

# Add PROJECT_ROOT to sys.path so 'main' app can be imported
if str(PROJECT_ROOT) not in sys.path:
    sys.path.append(str(PROJECT_ROOT))

print("BASE_DIR =", BASE_DIR)
print("PROJECT_ROOT =", PROJECT_ROOT)


# Quick-start development settings - unsuitable for production

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-9*vptkk&)4oyz*@-u%oj^4fkzc@#nbo!(8*=gzo7e0al_+orn#')

DEBUG = True

ALLOWED_HOSTS = [
    "renewone.co.in",
    "www.renewone.co.in",
    "127.0.0.1",
    "localhost",
    "187.127.131.185",
]

# Application definition

INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'main',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'mysite.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [PROJECT_ROOT / 'templates'],
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

WSGI_APPLICATION = 'mysite.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Email Configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', 587))
EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS', 'True') == 'True'
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL', EMAIL_HOST_USER)

# Message Tags for Bootstrap 5
from django.contrib.messages import constants as messages
MESSAGE_TAGS = {
    messages.DEBUG: 'alert-secondary',
    messages.INFO: 'alert-info',
    messages.SUCCESS: 'alert-success',
    messages.WARNING: 'alert-warning',
    messages.ERROR: 'alert-danger',
}

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

STATIC_URL = 'static/'

STATICFILES_DIRS = [
    PROJECT_ROOT / 'static_in_env',
]

STATIC_ROOT = BASE_DIR / "staticfiles"

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Media files (Images, etc.)
MEDIA_URL = '/media/'
MEDIA_ROOT = PROJECT_ROOT / 'media'

JAZZMIN_SETTINGS = {
    "site_title": "RenewOne Admin",
    "site_header": "RenewOne Solutions",
    "site_brand": "RenewOne",
    "welcome_sign": "Welcome to RenewOne Admin",
    "copyright": "RenewOne Solutions Pvt Ltd",

    "topmenu_links": [
        {"name": "Home", "url": "admin:index", "permissions": ["auth.view_user"]},
    ],

    "show_sidebar": True,
    "navigation_expanded": True,
    "icons": {
        "auth.User": "fas fa-user",
        "main.ContactInquiry": "fas fa-envelope",
        "main.Blog": "fas fa-blog",
        "main.Category": "fas fa-folder",
    },

}
JAZZMIN_UI_TWEAKS = {
    "navbar": "navbar-dark navbar-success",
    "sidebar": "sidebar-dark-success",
    "accent": "accent-success",
    "brand_colour": "navbar-success",
}
