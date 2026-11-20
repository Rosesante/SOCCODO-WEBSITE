
from django.contrib import admin
from .models import Story, ContactMessage, Activity, Event


@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'category',
        'published_at',
        'is_published',
    )

    list_filter = ('category', 'is_published')
    search_fields = ('title', 'excerpt', 'content')
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ('is_published',)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = (
        'full_name',
        'email',
        'support_type',
        'is_read',
        'created_at',
    )
    list_filter = ('support_type', 'is_read', 'created_at')
    search_fields = ('full_name', 'email', 'message')
    readonly_fields = ('created_at',)
    list_editable = ('is_read',)
    ordering = ('-created_at',)


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active", "display_order")
    list_filter = ("is_active",)
    search_fields = ("title", "description")
    list_editable = ("is_active", "display_order")


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'category',
        'start_at',
        'end_at',
        'is_published',
    )
    list_filter = ('category', 'is_published')
    search_fields = ('title', 'location')