import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'SOCCODO.settings')
django.setup()
from django.contrib.admin import site
from django.contrib.auth.models import User
print('before:', type(site._registry.get(User)).__module__ if site.is_registered(User) else None)
try:
    site.unregister(User)
    print('unregister ok')
except Exception as e:
    print('unregister failed:', type(e).__name__, e)
import accounts.admin
print('after:', type(site._registry.get(User)).__module__ if site.is_registered(User) else None)
