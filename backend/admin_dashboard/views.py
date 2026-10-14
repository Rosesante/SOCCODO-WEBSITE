from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count
from .models import Message, Project
from .serializer import (
    MessageSerializer,
    ProjectSerializer,
    MessageStatsSerializer,
    MessageStatusUpdateSerializer,
)


class MessageCreateView(generics.CreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer


class MessageListView(generics.ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        queryset = Message.objects.all()
        status_filter = self.request.query_params.get('status', None)
        if status_filter and status_filter != 'all':
            queryset = queryset.filter(status=status_filter)
        return queryset


class MessageStatsView(APIView):
    def get(self, request):
        stats = Message.objects.values('subject').annotate(count=Count('subject')).order_by('-count')
        serializer = MessageStatsSerializer(stats, many=True)
        
        status_counts = Message.objects.values('status').annotate(count=Count('status'))
        status_dict = {item['status']: item['count'] for item in status_counts}
        
        return Response({
            'by_subject': serializer.data,
            'by_status': {
                'all': Message.objects.count(),
                'unread': status_dict.get('unread', 0),
                'read': status_dict.get('read', 0),
                'replied': status_dict.get('replied', 0),
            }
        })


class MessageStatusUpdateView(generics.UpdateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageStatusUpdateSerializer
    lookup_field = 'pk'


class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer