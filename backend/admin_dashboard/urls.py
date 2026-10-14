from django.urls import path
from .views import (
    MessageCreateView,
    MessageListView,
    MessageStatsView,
    MessageStatusUpdateView,
    ProjectListCreateView,
    ProjectDetailView,
)

urlpatterns = [
    path('messages/', MessageCreateView.as_view(), name='message-create'),
    path('messages/list/', MessageListView.as_view(), name='message-list'),
    path('messages/stats/', MessageStatsView.as_view(), name='message-stats'),
    path('messages/<int:pk>/status/', MessageStatusUpdateView.as_view(), name='message-status-update'),
    path('projects/', ProjectListCreateView.as_view(), name='project-list-create'),
    path('projects/<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
]