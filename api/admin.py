from django.contrib import admin

from .models import UserData, NotificationSettings, PrivacySettings, ThemeSettings, Theme


# Register your models here.

class UserDataAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'theme_settings')


admin.site.register(Theme)
admin.site.register(ThemeSettings)
admin.site.register(PrivacySettings)
admin.site.register(NotificationSettings)
admin.site.register(UserData, UserDataAdmin)
