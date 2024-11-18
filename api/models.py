from django.core.validators import MinLengthValidator, MaxValueValidator, MinValueValidator
from django.db import models


# Create your models here.

class NotificationSettings(models.Model):
    email_notifications = models.BooleanField()
    push_notifications = models.BooleanField()
    frequency = models.IntegerField(validators=[
        MaxValueValidator(10),
        MinValueValidator(1)
    ])


class PrivacySettings(models.Model):
    visibility = models.BooleanField()
    data_sharing = models.BooleanField()


class Theme(models.Model):
    name = models.CharField(max_length=30)
    file_name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class ThemeSettings(models.Model):
    theme = models.ForeignKey(Theme, on_delete=models.CASCADE)
    font = models.CharField(max_length=100)

    def __str__(self):
        return self.theme.name


class UserData(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=20, unique=True, validators=[MinLengthValidator(4)])
    email = models.EmailField()
    password = models.CharField(max_length=20, validators=[MinLengthValidator(6)])
    notification_settings = models.OneToOneField(NotificationSettings, on_delete=models.CASCADE)
    privacy_settings = models.OneToOneField(PrivacySettings, on_delete=models.CASCADE)
    theme_settings = models.OneToOneField(ThemeSettings, on_delete=models.CASCADE)

    def __str__(self):
        return self.username

    class Meta:
        verbose_name_plural = 'User Data'
