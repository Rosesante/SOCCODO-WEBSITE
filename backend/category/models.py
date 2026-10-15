from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']


class GalleryImage(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='gallery_images')
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='gallery/')
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0, help_text="Display order within the category")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "Gallery Images"
        ordering = ['order', '-created_at']
