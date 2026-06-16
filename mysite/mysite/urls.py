from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),

    path('about/', views.about, name='about'),

    path('services/', views.services, name='services'),

    path('projects/', views.projects, name='projects'),

    path('blog/', views.blog, name='blog'),

    path('contact/', views.contact, name='contact'),

    path('feature/', views.feature, name='feature'),

    path('quote/', views.quote, name='quote'),

    path('solar-calculator/', views.solar_calculator, name='solar_calculator'),
]