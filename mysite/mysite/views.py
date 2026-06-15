from django.shortcuts import render

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