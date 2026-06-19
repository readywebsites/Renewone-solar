from django.contrib import admin
from .models import ContactInquiry, Category, Blog
from .models import SolarLead


admin.site.site_header = "RenewOne"
admin.site.site_title = "RenewOne Admin"
admin.site.index_title = ""

@admin.register(ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('created_at',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'is_published', 'is_featured', 'created_at')
    list_filter = ('is_published', 'is_featured', 'category', 'created_at')
    search_fields = ('title', 'content', 'short_description')
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ('is_published', 'is_featured')
    date_hierarchy = 'created_at'

@admin.register(SolarLead)
class SolarLeadAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'phone',
        'recommended_kw',
        'monthly_savings',
        'created_at'
    )

    search_fields = ('name', 'phone', 'email')