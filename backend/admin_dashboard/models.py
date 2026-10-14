from django.db import models
from django.conf import settings


class Message(models.Model):
    STATUS_CHOICES = [
        ('unread', 'Unread'),
        ('read', 'Read'),
        ('replied', 'Replied'),
    ]
    
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unread')
    sent_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    replied_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f'{self.name} - {self.subject}'

    class Meta:
        ordering = ['-sent_at']


class Reply(models.Model):
    VIA_CHOICES = [
        ('email', 'Email'),
        ('phone', 'Phone/SMS'),
    ]
    
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='replies')
    admin_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    content = models.TextField()
    via = models.CharField(max_length=10, choices=VIA_CHOICES)
    sent_at = models.DateTimeField(auto_now_add=True)
    success = models.BooleanField(default=False)
    error_message = models.TextField(blank=True)

    def __str__(self):
        return f'Reply to {self.message.name} via {self.via}'

    class Meta:
        ordering = ['-sent_at']


class Project(models.Model):
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]
    
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(
        upload_to="projects/",
        blank=True,
        null=True,
        help_text="Upload an image for this project (e.g., project screenshot or thumbnail)"
    )
    project_url = models.URLField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    project_type = models.CharField(max_length=100, blank=True)
    category = models.ForeignKey('category.Category', on_delete=models.SET_NULL, null=True, blank=True, help_text="Select a category for this project")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']