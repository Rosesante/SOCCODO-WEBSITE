from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Category, GalleryImage
from .serializer import CategorySerializer, GalleryImageSerializer


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


class GalleryImageListCreateView(generics.ListCreateAPIView):
    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageSerializer


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
