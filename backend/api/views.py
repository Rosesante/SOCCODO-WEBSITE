from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils import timezone
from .permissions import IsSuperUser
from .models import Story, GalleryImage, ContactMessage, Activity, Event
from .serializers import StorySerializer, GalleryImageSerializer, ContactMessageSerializer, ActivitySerializer, EventSerializer, AdminStorySerializer, AdminGalleryImageSerializer, AdminEventSerializer, SuperUserTokenObtainPairSerializer


class StoryListAPIView(generics.ListAPIView):
    serializer_class = StorySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Story.objects.filter(is_published=True)

        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__iexact=category)

        return queryset


class GalleryListAPIView(generics.ListAPIView):
    serializer_class = GalleryImageSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = GalleryImage.objects.filter(is_published=True)

        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__iexact=category)

        return queryset


class ContactMessageCreateAPIView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]


class ActivityListAPIView(generics.ListAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Activity.objects.filter(
            is_active=True
        ).order_by("display_order", "id")


class EventListAPIView(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Event.objects.filter(
            is_published=True
        ).order_by('start_at')

class AdminStoryViewSet(viewsets.ModelViewSet):
    queryset = Story.objects.all()
    serializer_class = AdminStorySerializer

    permission_classes = [
        IsSuperUser
    ]

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]

    def get_queryset(self):
        queryset = Story.objects.all()

        category = self.request.query_params.get('category')
        published = self.request.query_params.get('is_published')

        if category:
            queryset = queryset.filter(category__iexact=category)

        if published in ['true', 'false']:
            queryset = queryset.filter(
                is_published=(published == 'true')
            )

        return queryset.order_by('-published_at')   

class AdminGalleryViewSet(viewsets.ModelViewSet):
    queryset = GalleryImage.objects.all()
    serializer_class = AdminGalleryImageSerializer

    permission_classes = [
        IsSuperUser,
    ]

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]

    def get_queryset(self):
        queryset = GalleryImage.objects.all()

        category = self.request.query_params.get('category')
        published = self.request.query_params.get('is_published')

        if category:
            queryset = queryset.filter(category__iexact=category)

        if published in ['true', 'false']:
            queryset = queryset.filter(
                is_published=(published == 'true')
            )

        return queryset.order_by('-created_at') 

class AdminEventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = AdminEventSerializer

    permission_classes = [
        IsSuperUser,
    ]

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]

    def get_queryset(self):
        queryset = Event.objects.all()

        category = self.request.query_params.get('category')
        published = self.request.query_params.get('is_published')
        status = self.request.query_params.get('status')

        now = timezone.now()

        if category:
            queryset = queryset.filter(category__iexact=category)

        if published in ['true', 'false']:
            queryset = queryset.filter(
                is_published=(published == 'true')
            )

        if status == 'past':
            queryset = queryset.filter(end_at__lt=now)

        elif status == 'upcoming':
            queryset = queryset.filter(start_at__gt=now)

        elif status == 'ongoing':
            queryset = queryset.filter(
                start_at__lte=now,
                end_at__gte=now,
            )

        return queryset.order_by('start_at')    

class AdminLoginView(TokenObtainPairView):
    serializer_class = SuperUserTokenObtainPairSerializer