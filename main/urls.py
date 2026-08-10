from django.urls import path
from .views import contact_view
from main import views

urlpatterns = [
    path('', contact_view, name='contact'),
    path('save-solar-lead/', views.save_solar_lead, name='save_solar_lead'),
    path('service-inquiry/', views.save_service_inquiry, name='service_inquiry'),
    path('free-quote/', views.quote_form, name='quote_form'),
    path('gallery/', views.gallery, name='gallery'),

]
