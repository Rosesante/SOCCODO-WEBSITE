from django.db.models import Count
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Category, GalleryImage
from .serializer import CategorySerializer, GalleryImageSerializer
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from api.permissions import IsSuperUser


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CategoryStatsView(APIView):
    def get(self, request):
        total_categories = Category.objects.count()

        categories_with_projects = Category.objects.annotate(
            project_count=Count('project')
        ).values('id', 'name', 'project_count').order_by('-project_count')

        return Response({
            'total_categories': total_categories,
            'categories': list(categories_with_projects),
        })


class GalleryImageListCreateView(generics.ListAPIView):
    serializer_class = GalleryImageSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return GalleryImage.objects.filter(
            is_published=True
        ).select_related('category').order_by('order', '-created_at')

class GalleryImageDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageSerializer


class GalleryByCategoryView(APIView):
    def get(self, request):
        categories = Category.objects.prefetch_related('gallery_images').all()
        data = []
        for category in categories:
            serializer = GalleryImageSerializer(category.gallery_images.all(), many=True, context={'request': request})
            data.append({
                'id': category.id,
                'name': category.name,
                'images': serializer.data,
            })
        return Response(data)

class AdminGalleryImageListCreateView(generics.ListCreateAPIView):
    queryset = GalleryImage.objects.select_related(
        'category'
    ).all().order_by('order', '-created_at')

    serializer_class = GalleryImageSerializer
    permission_classes = [IsSuperUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class AdminGalleryImageDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = GalleryImage.objects.select_related('category').all()

    serializer_class = GalleryImageSerializer
    permission_classes = [IsSuperUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]