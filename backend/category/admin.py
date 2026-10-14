from django.contrib import admin
from .models import Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('name', 'description')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('name',)
    
    def changelist_view(self, request, extra_context=None):
        # Add total count to the template context
        total_categories = Category.objects.count()
        extra_context = extra_context or {}
        extra_context['total_categories'] = total_categories
        return super().changelist_view(request, extra_context=extra_context)
