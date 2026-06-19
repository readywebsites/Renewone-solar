from django.urls import path
from .views import contact_view
from main import views

urlpatterns = [
    path('', contact_view, name='contact'),
path(
    'save-solar-lead/',
    views.save_solar_lead,
    name='save_solar_lead'
),
]