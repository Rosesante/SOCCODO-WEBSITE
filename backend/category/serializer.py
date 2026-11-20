from rest_framework import serializers
from .models import Category, GalleryImage


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']



class GalleryImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    category_name = serializers.CharField(
        source='category.name',
        read_only=True
    )

    class Meta:
        model = GalleryImage
        fields = [
            'id',
            'category',
            'category_name',
            'title',
            'caption',
            'image',
            'image_url',
            'alt_text',
            'is_featured',
            'is_published',
            'order',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'image_url',
            'created_at',
            'updated_at',
        ]

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            return (
                request.build_absolute_uri(obj.image.url)
                if request else obj.image.url
            )
        return None
