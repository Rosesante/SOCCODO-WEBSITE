from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView,)

from .views import (
    StoryListAPIView,
    GalleryListAPIView,
    ContactMessageCreateAPIView,
    ActivityListAPIView,
    EventListAPIView,
    AdminStoryViewSet,
    AdminGalleryViewSet,
    AdminEventViewSet,
    AdminLoginView,
)

router = DefaultRouter()

router.register(
    r'admin/stories',
    AdminStoryViewSet,
    basename='admin-stories',
)

router.register(
    r'admin/gallery',
    AdminGalleryViewSet,
    basename='admin-gallery',
)

router.register(
    r'admin/events',
    AdminEventViewSet,
    basename='admin-events',
)

urlpatterns = [
    path('stories/', StoryListAPIView.as_view(), name='story-list'),
    path('gallery/', GalleryListAPIView.as_view(), name='gallery-list'),

    path(
        'contact/',
        ContactMessageCreateAPIView.as_view(),
        name='contact-message-create',
    ),

    path(
        'activities/',
        ActivityListAPIView.as_view(),
        name='activity-list',
    ),

    path(
        'events/',
        EventListAPIView.as_view(),
        name='event-list',
    ),

    path('', include(router.urls)),

    path('auth/login/', AdminLoginView.as_view(), name='admin-login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]