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
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField()

    state = models.CharField(max_length=100)
    category = models.CharField(max_length=50)

    calculation_type = models.CharField(max_length=50)
    input_value = models.FloatField()

    recommended_kw = models.FloatField()
    monthly_savings = models.FloatField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

calculation_type = models.CharField(max_length=50)
input_value = models.FloatField()

recommended_kw = models.FloatField()
monthly_savings = models.FloatField()

created_at = models.DateTimeField(auto_now_add=True)

def __str__(self):
    return self.name
