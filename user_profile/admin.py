from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    # Add custom fields to the user list display
    list_display = ('username', 'email', 'is_customer', 'is_support', 'is_staff')

    # Add custom fields to the fieldsets to make them editable in the admin form
    fieldsets = UserAdmin.fieldsets + (
        ('User Roles', {'fields': ('is_customer', 'is_support')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('User Roles', {'fields': ('is_customer', 'is_support')}),
    )

admin.site.register(User, CustomUserAdmin)
