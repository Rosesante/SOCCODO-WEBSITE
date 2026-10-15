import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'SOCCODO.settings')
django.setup()
from django.contrib.admin import site
from django.contrib.auth.models import User

print('initial:', type(site._registry[User]).__module__)

from django.contrib.admin.views.decorators import staff_member_required  # noqa
try:
    site.unregister(User)
    print('unregister ok')
except Exception as e:
    print('unregister failed:', type(e).__name__, e)

from accounts.admin import UserAdmin as AccountsUserAdmin  # noqa
try:
    site.register(User, AccountsUserAdmin)
    print('register ok:', type(site._registry[User]).__module__)
except Exception as e:
    print('register failed:', type(e).__name__, e)
