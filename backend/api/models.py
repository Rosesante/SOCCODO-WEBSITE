from django.db import models
from django.utils import timezone
from django.utils.text import slugify


class Story(models.Model):
    CATEGORY_CHOICES = [
        ('Community Development', 'Community Development'),
        ('Climate & Environment', 'Climate & Environment'),
        ('Education & Youth', 'Education & Youth'),
        ('Women & Social Welfare', 'Women & Social Welfare'),
        ('Water & Sanitation', 'Water & Sanitation'),
        ('Disaster Relief', 'Disaster Relief'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        default='Community Development',
    )
    excerpt = models.CharField(max_length=300)
    content = models.TextField()
    image = models.ImageField(
        upload_to='stories/',
        blank=True,
        null=True,
    )
    image_alt = models.CharField(max_length=200, blank=True)
    published_at = models.DateTimeField(default=timezone.now)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-published_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title) or 'story'
            candidate = base_slug
            number = 2

            while Story.objects.filter(slug=candidate).exclude(pk=self.pk).exists():
                candidate = f'{base_slug}-{number}'
                number += 1

            self.slug = candidate

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class GalleryImage(models.Model):
    CATEGORY_CHOICES = [
        ('Community Development', 'Community Development'),
        ('Climate & Environment', 'Climate & Environment'),
        ('Education & Youth', 'Education & Youth'),
        ('Women & Social Welfare', 'Women & Social Welfare'),
        ('Water & Sanitation', 'Water & Sanitation'),
        ('Disaster Relief', 'Disaster Relief'),
    ]

    title = models.CharField(max_length=200)
    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        default='Community Development',
    )
    caption = models.CharField(max_length=300, blank=True)
    image = models.ImageField(upload_to='gallery/')
    alt_text = models.CharField(max_length=200)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Gallery Image'
        verbose_name_plural = 'Gallery Images'

    def __str__(self):
        return self.title


class ContactMessage(models.Model):
    SUPPORT_CHOICES = [
        ('Donation', 'Donation'),
        ('Volunteer', 'Volunteer'),
        ('Partnership', 'Partnership'),
        ('Supplies', 'Supplies'),
        ('Other Support', 'Other Support'),
    ]

    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    support_type = models.CharField(
        max_length=100,
        choices=SUPPORT_CHOICES,
    )
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Message'
        verbose_name_plural = 'Contact Messages'

    def __str__(self):
        return f'{self.full_name} - {self.support_type}'


class Activity(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to="activities/")
    image_alt = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["display_order", "id"]
        verbose_name = "What We Do Activity"
        verbose_name_plural = "What We Do Activities"

    def __str__(self):
        return self.title


class Event(models.Model):
    CATEGORY_CHOICES = [
        ('Community Development', 'Community Development'),
        ('Climate & Environment', 'Climate & Environment'),
        ('Education & Youth', 'Education & Youth'),
        ('Women & Social Welfare', 'Women & Social Welfare'),
        ('Water & Sanitation', 'Water & Sanitation'),
        ('Disaster Relief', 'Disaster Relief'),
        ('Other', 'Other'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        default='Other',
    )
    description = models.TextField()
    location = models.CharField(max_length=200)
    start_at = models.DateTimeField()
    end_at = models.DateTimeField()
    image = models.ImageField(upload_to='events/', blank=True, null=True)
    image_alt = models.CharField(max_length=200, blank=True)
    video = models.FileField(upload_to='events/videos/',blank=True,null=True)
    youtube_url = models.URLField(blank=True,null=True,help_text="Paste a YouTube video URL (optional).")
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['start_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title) or 'event'
            candidate = base_slug
            number = 2

            while Event.objects.filter(slug=candidate).exclude(pk=self.pk).exists():
                candidate = f'{base_slug}-{number}'
                number += 1

            self.slug = candidate

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title