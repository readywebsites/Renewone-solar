from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from django.core.paginator import Paginator
from django.db.models import Q
import json

from .forms import ContactForm
from .models import Blog, Category, SolarLead


def contact_view(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)

        if form.is_valid():
            inquiry = form.save()

            subject = f"New Contact Inquiry: {inquiry.subject}"

            message_body = f"""
You have received a new contact inquiry from your website.

Details:
Name: {inquiry.name}
Email: {inquiry.email}
Subject: {inquiry.subject}

Message:
{inquiry.message}

Date: {inquiry.created_at}
            """

            sender_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = ['sales@renewone.co.in']

            try:
                send_mail(
                    subject,
                    message_body,
                    sender_email,
                    recipient_list,
                    fail_silently=False,
                )

                messages.success(
                    request,
                    'Your message has been sent successfully! We will get back to you soon.'
                )

            except Exception as e:
                messages.success(
                    request,
                    'Your message has been received. Thank you!'
                )

                print(f"Error sending email: {e}")

            return redirect('contact')

        else:
            messages.error(
                request,
                'There was an error with your submission. Please check the form.'
            )

    else:
        form = ContactForm()

    return render(request, 'contact.html', {'form': form})


def blog_list(request):
    query = request.GET.get('q')
    category_slug = request.GET.get('category')

    blogs = Blog.objects.filter(is_published=True)
    featured_blog = Blog.objects.filter(
        is_published=True,
        is_featured=True
    ).first()

    categories = Category.objects.all()

    if query:
        blogs = blogs.filter(
            Q(title__icontains=query) |
            Q(content__icontains=query) |
            Q(category__name__icontains=query)
        )

    if category_slug:
        blogs = blogs.filter(category__slug=category_slug)

    paginator = Paginator(blogs, 6)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'blogs': page_obj,
        'featured_blog': featured_blog,
        'categories': categories,
        'search_query': query,
        'category_slug': category_slug
    }

    return render(request, 'blog.html', context)


def blog_detail(request, slug):

    blog = get_object_or_404(
        Blog,
        slug=slug,
        is_published=True
    )

    related_posts = Blog.objects.filter(
        category=blog.category,
        is_published=True
    ).exclude(
        id=blog.id
    )[:3]

    recent_posts = Blog.objects.filter(
        is_published=True
    ).exclude(
        id=blog.id
    ).order_by('-created_at')[:5]

    categories = Category.objects.all()

    context = {
        'blog': blog,
        'related_posts': related_posts,
        'recent_posts': recent_posts,
        'categories': categories
    }

    return render(
        request,
        'blog_detail.html',
        context
    )


def save_solar_lead(request):

    if request.method == "POST":

        data = json.loads(request.body)

        SolarLead.objects.create(
            name=data["name"],
            phone=data["phone"],
            email=data["email"],
            state=data["state"],
            category=data["category"],
            calculation_type=data["calculation_type"],
            input_value=data["input_value"],
            recommended_kw=data["recommended_kw"],
            monthly_savings=data["monthly_savings"]
        )

        return JsonResponse({
            "status": "success"
        })