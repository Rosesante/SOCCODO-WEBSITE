from django.urls import path
from .views import (
    CategoryListCreateView,
    CategoryDetailView,
    CategoryStatsView,
    GalleryImageListCreateView,
    GalleryImageDetailView,
    GalleryByCategoryView,
)

urlpatterns = [
    path('categories/', CategoryListCreateView.as_view(), name='category-list'),
    path('categories/stats/', CategoryStatsView.as_view(), name='category-stats'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),
    path('gallery/', GalleryImageListCreateView.as_view(), name='gallery-image-list-create'),
    path('gallery/<int:pk>/', GalleryImageDetailView.as_view(), name='gallery-image-detail'),
    path('gallery/by-category/', GalleryByCategoryView.as_view(), name='gallery-by-category'),
]