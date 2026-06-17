from django.shortcuts import render, redirect
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from .forms import ContactForm

def contact_view(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            # Save to database
            inquiry = form.save()
            
            # Send email notification
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
                messages.success(request, 'Your message has been sent successfully! We will get back to you soon.')
            except Exception as e:
                # Still show success for saving to DB, but log email error
                messages.success(request, 'Your message has been received. Thank you!')
                # In a real production environment, use proper logging
                print(f"Error sending email: {e}")
            
            return redirect('contact')
        else:
            messages.error(request, 'There was an error with your submission. Please check the form.')
    else:
        form = ContactForm()
    
    return render(request, 'contact.html', {'form': form})
