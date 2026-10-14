from rest_framework import serializers
from .models import Message, Project, Reply


class ReplySerializer(serializers.ModelSerializer):
    admin_username = serializers.CharField(source='admin_user.username', read_only=True)
    
    class Meta:
        model = Reply
        fields = [
            'id',
            'message',
            'admin_user',
            'admin_username',
            'content',
            'via',
            'sent_at',
            'success',
            'error_message',
        ]
        read_only_fields = ['id', 'sent_at', 'admin_user', 'admin_username', 'success', 'error_message']


class ReplyCreateSerializer(serializers.Serializer):
    content = serializers.CharField()
    via = serializers.ChoiceField(choices=['email', 'phone'])


class MessageSerializer(serializers.ModelSerializer):
    replies = ReplySerializer(many=True, read_only=True)
    replies_count = serializers.IntegerField(source='replies.count', read_only=True)
    
    class Meta:
        model = Message
        fields = [
            'id',
            'name',
            'email',
            'phone',
            'subject',
            'message',
            'status',
            'sent_at',
            'read_at',
            'replied_at',
            'replies',
            'replies_count',
        ]
        read_only_fields = ['id', 'sent_at', 'read_at', 'replied_at', 'replies', 'replies_count']


class MessageStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['status']
        
    def update(self, instance, validated_data):
        from django.utils import timezone
        new_status = validated_data.get('status', instance.status)
        if new_status == 'read' and instance.status == 'unread':
            instance.read_at = timezone.now()
        elif new_status == 'replied' and instance.status != 'replied':
            instance.replied_at = timezone.now()
        instance.status = new_status
        instance.save()
        return instance


class MessageStatsSerializer(serializers.Serializer):
    subject = serializers.CharField()
    count = serializers.IntegerField()


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            'id',
            'title',
            'description',
            'image',
            'project_url',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']