from django.urls import path
from .views import RegisterView, LoginView, LogoutView, CurrentUserView, CsrfTokenView

urlpatterns = [
    path('accounts/register/', RegisterView.as_view(), name='account-register'),
    path('accounts/login/', LoginView.as_view(), name='account-login'),
    path('accounts/logout/', LogoutView.as_view(), name='account-logout'),
    path('accounts/me/', CurrentUserView.as_view(), name='account-me'),
    path('accounts/csrf/', CsrfTokenView.as_view(), name='account-csrf'),
]
