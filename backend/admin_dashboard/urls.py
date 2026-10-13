from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include

urlpatterns = [
    
]
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        DOCUMENT_root=settings.MEDIA_ROOT
    )