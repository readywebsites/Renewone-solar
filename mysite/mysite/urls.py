from django.contrib import admin
from django.urls import path, include
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('', views.index, name='index'),

    path('about/', views.about, name='about'),

    path('services/', views.services, name='services'),

    path('projects/', views.projects, name='projects'),

    path('blog/', include('main.urls_blog')), # Blog Management

    path('contact/', include('main.urls')), # Contact Form Management

    path('feature/', views.feature, name='feature'),

    path('quote/', views.quote, name='quote'),

    path('solar-calculator/', views.solar_calculator, name='solar_calculator'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
