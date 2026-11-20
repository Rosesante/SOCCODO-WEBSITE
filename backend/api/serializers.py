from rest_framework import serializers
from .models import Story, GalleryImage, ContactMessage, Activity, Event
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from django.utils import timezone
from django.conf import settings


class StorySerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Story
        fields = [
            'id',
            'title',
            'slug',
            'category',
            'excerpt',
            'content',
            'image_url',
            'image_alt',
            'published_at',
        ]

    def get_image_url(self, obj):
        if not obj.image:
            return None

        request = self.context.get('request')
        image_url = obj.image.url

        if request:
            return request.build_absolute_uri(image_url)

        return image_url


class GalleryImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = GalleryImage
        fields = [
            'id',
            'title',
            'category',
            'caption',
            'image_url',
            'alt_text',
            'created_at',
        ]

    def get_image_url(self, obj):
        if not obj.image:
            return None

        request = self.context.get('request')
        image_url = obj.image.url

        if request:
            return request.build_absolute_uri(image_url)

        return image_url

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = [
            'full_name',
            'email',
            'support_type',
            'message',
        ]

    def validate_full_name(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                'Full name is required.'
            )
        return value.strip()

    def validate_message(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                'Message is required.'
            )
        return value.strip()


class ActivitySerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = [
            "id",
            "title",
            "description",
            "image_url",
            "image_alt",
            "is_active",
            "display_order",
        ]

    def get_image_url(self, obj):
        if not obj.image:
            return None

        request = self.context.get("request")
        image_url = obj.image.url

        if request:
            return request.build_absolute_uri(image_url)

        return image_url


class EventSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id',
            'title',
            'slug',
            'category',
            'description',
            'location',
            'start_at',
            'end_at',
            'image_url',
            'image_alt',
            'status',
        ]

    def get_image_url(self, obj):
        if not obj.image:
            return None

        request = self.context.get('request')
        image_url = obj.image.url

        if request:
            return request.build_absolute_uri(image_url)

        return image_url

    def get_status(self, obj):
        now = timezone.now()

        if obj.end_at < now:
            return 'past'
        elif obj.start_at > now:
            return 'upcoming'

        return 'ongoing'

class AdminStorySerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Story
        fields = [
            'id',
            'title',
            'slug',
            'category',
            'content',
            'image',
            'image_url',
            'image_alt',
            'published_at',
            'is_published',
            'created_at',
        ]

        read_only_fields = [
            'id',
            'slug',
            'created_at',
        ]

    def get_image_url(self, obj):
        if not obj.image:
            return None

        request = self.context.get('request')
        image_url = obj.image.url

        if request:
            return request.build_absolute_uri(image_url)

        return image_url    

class AdminGalleryImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = GalleryImage
        fields = [
            'id',
            'title',
            'category',
            'caption',
            'image',
            'image_url',
            'alt_text',
            'is_published',
            'created_at',
        ]

        read_only_fields = [
            'id',
            'created_at',
        ]

    def get_image_url(self, obj):
        if not obj.image:
            return None

        request = self.context.get('request')
        image_url = obj.image.url

        if request:
            return request.build_absolute_uri(image_url)

        return image_url

class AdminEventSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id',
            'title',
            'slug',
            'category',
            'description',
            'location',
            'start_at',
            'end_at',
            'image',
            'image_url',
            'image_alt',
            'is_published',
            'status',
            'created_at',
        ]

        read_only_fields = [
            'id',
            'slug',
            'status',
            'created_at',
        ]

    def get_image_url(self, obj):
        if not obj.image:
            return None

        request = self.context.get('request')
        image_url = obj.image.url

        if request:
            return request.build_absolute_uri(image_url)

        return image_url

    def get_status(self, obj):
        now = timezone.now()

        if obj.end_at < now:
            return 'past'
        elif obj.start_at > now:
            return 'upcoming'

        return 'ongoing'

    def validate(self, attrs):
        start_at = attrs.get(
            'start_at',
            self.instance.start_at if self.instance else None
        )

        end_at = attrs.get(
            'end_at',
            self.instance.end_at if self.instance else None
        )

        if start_at and end_at and end_at < start_at:
            raise serializers.ValidationError({
                'end_at': 'Event ending time cannot be earlier than starting time.'
            })

        return attrs   

class SuperUserTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)

        if (
            not self.user.is_superuser
            or self.user.username != settings.SOCCODO_ADMIN_USERNAME
        ):
            raise AuthenticationFailed(
                'You are not authorized to access SOCCODO administration.'
            )

        return data