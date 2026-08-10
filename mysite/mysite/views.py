from django.shortcuts import render

from main.models import Installation

def index(request):
    return render(request, 'index.html')

def about(request):
    return render(request, 'about.html')

def services(request):
    return render(request, 'service.html')

def projects(request):
    return render(request, 'project.html')

def blog(request):
    return render(request, 'blog.html')

def contact(request):
    return render(request, 'contact.html')

def feature(request):
    return render(request, 'feature.html')

def quote(request):
    return render(request, 'quote.html')

def solar_calculator(request):
    return render(request, 'solar-calculator.html')

def gallery(request):
    installations = Installation.objects.all().order_by('-created_at')

    return render(request, 'gallery.html', {
        'installations': installations
    })