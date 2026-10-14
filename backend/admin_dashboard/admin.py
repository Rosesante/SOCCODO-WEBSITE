from django.contrib import admin
from .models import Message, Project


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'status', 'sent_at', 'read_at', 'replied_at')
    list_filter = ('status', 'sent_at')
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('sent_at',)
    list_editable = ('status',)
    date_hierarchy = 'sent_at'
    ordering = ('-sent_at',)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at')
    search_fields = ('title', 'description')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
