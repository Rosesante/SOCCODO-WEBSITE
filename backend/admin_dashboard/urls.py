from django.urls import path
from .views import (
    MessageCreateView,
    MessageListView,
    MessageStatsView,
    MessageStatusUpdateView,
    ReplyCreateView,
    ReplyListView,
    ProjectListCreateView,
    ProjectDetailView,
    UserStatsView,
)

urlpatterns = [
    path('messages/', MessageCreateView.as_view(), name='message-create'),
    path('messages/list/', MessageListView.as_view(), name='message-list'),
    path('messages/stats/', MessageStatsView.as_view(), name='message-stats'),
    path('messages/<int:pk>/status/', MessageStatusUpdateView.as_view(), name='message-status-update'),
    path('messages/<int:pk>/reply/', ReplyCreateView.as_view(), name='message-reply'),
    path('messages/<int:message_id>/replies/', ReplyListView.as_view(), name='message-replies'),
    path('projects/', ProjectListCreateView.as_view(), name='project-list-create'),
    path('projects/<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
    path('users/stats/', UserStatsView.as_view(), name='user-stats'),
]