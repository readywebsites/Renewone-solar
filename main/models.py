from django.db import models
from django.utils.text import slugify
from django.contrib.auth.models import User

class ContactInquiry(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.subject} - {self.name}"

class Meta:
    verbose_name = "Contact Inquiry"
    verbose_name_plural = "Contact Inquiries"
    ordering = ['-created_at']

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"

class Blog(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True, max_length=255)

    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='blog_posts'
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name='blogs'
    )

    thumbnail_image = models.ImageField(
        upload_to='blog_thumbnails/',
        blank=True,
        null=True
    )

    featured_image = models.ImageField(
        upload_to='blog_images/'
    )

    short_description = models.TextField(max_length=500)
    content = models.TextField()

    is_published = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']

class SolarLead(models.Model):
    full_name = models.CharField(max_length=100, default="")
    mobile = models.CharField(max_length=20, default="")
    email = models.EmailField(default="")
    city = models.CharField(max_length=100, default="")
    
    calculation_type = models.CharField(max_length=50, default="")
    input_value = models.FloatField(default=0.0)
    state = models.CharField(max_length=100, default="")
    category = models.CharField(max_length=100, default="")
    unit_cost = models.FloatField(default=0.0)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} ({self.mobile})"

class ServiceInquiry(models.Model):
    name = models.CharField(max_length=255)
    mobile = models.CharField(max_length=20)
    email = models.EmailField()
    city = models.CharField(max_length=255)
    service = models.CharField(max_length=255)
    message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.service} - {self.name} ({self.mobile})"

    class Meta:
        verbose_name = "Service Inquiry"
        verbose_name_plural = "Service Inquiries"
        ordering = ['-created_at']

class Installation(models.Model):
    title = models.CharField(max_length=200)
    location = models.CharField(max_length=200, blank=True)
    image = models.ImageField(upload_to='installations/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']