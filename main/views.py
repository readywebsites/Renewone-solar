from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from django.core.paginator import Paginator
from django.db.models import Q
import json

from .forms import ContactForm
from .models import Blog, Category, SolarLead, ServiceInquiry


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
        try:
            if request.content_type == 'application/json':
                data = json.loads(request.body)
            else:
                data = request.POST

            full_name = data.get("full_name", "").strip()
            mobile = data.get("mobile", "").strip()
            email = data.get("email", "").strip()
            city = data.get("city", "").strip()
            
            calculation_type = data.get("calculation_type", "").strip()
            input_value = data.get("input_value")
            state = data.get("state", "").strip()
            category = data.get("category", "").strip()
            unit_cost = data.get("unit_cost")

            # Validation
            if not all([full_name, mobile, email, city]):
                return JsonResponse({
                    "status": "error",
                    "message": "All fields (Full Name, Mobile, Email, and City) are required."
                }, status=400)

            # Mobile number should accept only numeric values
            if not mobile.isdigit():
                return JsonResponse({
                    "status": "error",
                    "message": "Mobile number must contain only numbers."
                }, status=400)

            # Convert numeric fields
            try:
                input_value = float(input_value) if input_value is not None else 0.0
                unit_cost = float(unit_cost) if unit_cost is not None else 0.0
            except (TypeError, ValueError):
                return JsonResponse({
                    "status": "error",
                    "message": "Invalid numeric values for input calculations."
                }, status=400)

            # Create lead in database
            SolarLead.objects.create(
                full_name=full_name,
                mobile=mobile,
                email=email,
                city=city,
                calculation_type=calculation_type,
                input_value=input_value,
                state=state,
                category=category,
                unit_cost=unit_cost
            )

            return JsonResponse({
                "status": "success",
                "message": "Lead saved successfully."
            })
        except Exception as e:
            return JsonResponse({
                "status": "error",
                "message": str(e)
            }, status=500)

    return JsonResponse({"status": "error", "message": "Invalid request method."}, status=405)


def save_service_inquiry(request):
    if request.method == "POST":
        # Handle both JSON content and form URL encoded data
        if request.content_type == 'application/json':
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)
        else:
            data = request.POST

        name = data.get("name", "").strip()
        mobile = data.get("mobile", "").strip()
        email = data.get("email", "").strip()
        city = data.get("city", "").strip()
        service = data.get("service", "").strip()
        message = data.get("message", "").strip()

        # Validation
        if not all([name, mobile, email, city, service]):
            return JsonResponse({
                "status": "error",
                "message": "All required fields (Name, Mobile, Email, City, Service) must be filled."
            }, status=400)

        # Create record in DB
        inquiry = ServiceInquiry.objects.create(
            name=name,
            mobile=mobile,
            email=email,
            city=city,
            service=service,
            message=message
        )

        # Build WhatsApp URL
        whatsapp_text = (
            f"Hello RenewOne Team,\n\n"
            f"I am interested in:\n"
            f"{service}\n\n"
            f"Name: {name}\n"
            f"Mobile: {mobile}\n"
            f"City: {city}\n\n"
            f"Please send me a detailed quotation."
        )
        import urllib.parse
        encoded_text = urllib.parse.quote(whatsapp_text)
        whatsapp_url = f"https://wa.me/919474450575?text={encoded_text}"

        return JsonResponse({
            "status": "success",
            "message": "Enquiry saved successfully! Redirecting to WhatsApp...",
            "whatsapp_url": whatsapp_url
        })

    return JsonResponse({"status": "error", "message": "Method not allowed"}, status=405)

def quote_form(request):
    if request.method == "POST":

        ServiceInquiry.objects.create(
            name=request.POST.get('name'),
            mobile=request.POST.get('mobile'),
            email=request.POST.get('email'),
            city=request.POST.get('city'),
            service=request.POST.get('service'),
            message=request.POST.get('message')
        )

        messages.success(
            request,
            "Thank you! Our team will contact you soon."
        )

        return redirect('contact')

    return render(request, 'quote.html')