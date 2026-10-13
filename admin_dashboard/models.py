from django.db import models

class message(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    sent_at = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return f'{self.name} - {self.subject}'
    
class Project(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.imageField(
        upload_to = "projects/",
        blank = True,
        null = True
    )
    
    project_url = models.URLField(blank=True)
    
    def __str__(self):
     return self.title
    
    

# Create your models here.