from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from .models import Message, Project, Reply
from django.contrib.auth.models import User
from .serializer import (
    MessageSerializer,
    ProjectSerializer,
    MessageStatsSerializer,
    MessageStatusUpdateSerializer,
    ReplySerializer,
    ReplyCreateSerializer,
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


class ReplyCreateView(APIView):
    def post(self, request, pk):
        try:
            message = Message.objects.get(pk=pk)
        except Message.DoesNotExist:
            return Response({'error': 'Message not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ReplyCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        content = serializer.validated_data['content']
        via = serializer.validated_data['via']
        
        reply = Reply.objects.create(
            message=message,
            admin_user=request.user if request.user.is_authenticated else None,
            content=content,
            via=via,
        )
        
        success = False
        error_message = ''
        
        if via == 'email':
            success, error_message = self._send_email(message, content)
        elif via == 'phone':
            success, error_message = self._send_sms(message, content)
        
        reply.success = success
        reply.error_message = error_message
        reply.save()
        
        if success:
            message.status = 'replied'
            message.replied_at = timezone.now()
            message.save()
        
        response_serializer = ReplySerializer(reply)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED if success else status.HTTP_200_OK)
    
    def _send_email(self, message, content):
        try:
            subject = f'Re: {message.subject}'
            full_content = f"Dear {message.name},\n\n{content}\n\n---\nSOCCODO Team"
            
            send_mail(
                subject=subject,
                message=full_content,
                from_email=settings.DEFAULT_FROM_EMAIL if hasattr(settings, 'DEFAULT_FROM_EMAIL') else None,
                recipient_list=[message.email],
                fail_silently=False,
            )
            return True, ''
        except Exception as e:
            return False, str(e)
    
    def _send_sms(self, message, content):
        if not message.phone:
            return False, 'No phone number provided'
        
        try:
            # Placeholder for SMS integration (Twilio, etc.)
            # Example with Twilio:
            # from twilio.rest import Client
            # client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
            # client.messages.create(
            #     body=content,
            #     from_=settings.TWILIO_PHONE_NUMBER,
            #     to=message.phone
            # )
            
            # For now, log the SMS that would be sent
            print(f"SMS to {message.phone}: {content}")
            return True, 'SMS logged (configure Twilio or provider for actual sending)'
        except Exception as e:
            return False, str(e)


class ReplyListView(generics.ListAPIView):
    serializer_class = ReplySerializer
    
    def get_queryset(self):
        message_id = self.kwargs.get('message_id')
        return Reply.objects.filter(message_id=message_id)


class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class UserStatsView(APIView):
    def get(self, request):
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        inactive_users = User.objects.filter(is_active=False).count()
        staff_users = User.objects.filter(is_staff=True).count()
        return Response({
            'total_users': total_users,
            'active_users': active_users,
            'inactive_users': inactive_users,
            'staff_users': staff_users,
        })