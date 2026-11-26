from django.conf import settings
from rest_framework.permissions import BasePermission


class IsSuperUser(BasePermission):

    message = "Only the authorized administrator can access this resource."

    def has_permission(self, request, view):
        user = request.user
        
        return bool(
            user
            and user.is_authenticated
            and user.is_superuser
        )