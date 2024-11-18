from django.core import serializers
from django.core.exceptions import ObjectDoesNotExist
import json

from django.forms import model_to_dict
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from .models import UserData, Theme, NotificationSettings, PrivacySettings, ThemeSettings


# Create your views here.


def get_user_data(request, user_id):
    try:
        user_data = UserData.objects.select_related(
            'notification_settings',
            'privacy_settings',
            'theme_settings__theme'
        ).get(id=user_id)

        user_data_json = {
            "id": user_data.id,
            "username": user_data.username,
            'password': user_data.password,
            "email": user_data.email,
            "notification_settings": {
                "email_notifications": user_data.notification_settings.email_notifications,
                "push_notifications": user_data.notification_settings.push_notifications,
                "frequency": user_data.notification_settings.frequency,
            },
            "privacy_settings": {
                "profile_visibility": user_data.privacy_settings.visibility,
                "data_sharing": user_data.privacy_settings.data_sharing,
            },
            "theme_settings": {
                "theme_id": user_data.theme_settings.theme.id,
                "theme_file_name": user_data.theme_settings.theme.file_name,
                "font": user_data.theme_settings.font,
            }
        }

        return JsonResponse(user_data_json, status=200)
    except ObjectDoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

    except Exception as e:
        return JsonResponse({'error': 'An unexpected error occurred', 'details': str(e)}, status=500)


@csrf_exempt
def get_username_availability(request):
    try:
        data = json.loads(request.body)
        username = data['username']
        user_data = UserData.objects.get(username=username)
        return JsonResponse({'availability': False}, status=200)

    except ObjectDoesNotExist:
        return JsonResponse({'availability': True}, status=200)

    except Exception as e:
        return JsonResponse({'error': 'An unexpected error occurred', 'details': str(e)}, status=500)


@csrf_exempt
def update_user_data(request):
    try:
        data = json.loads(request.body)
        user_id = data['id']
        user = UserData.objects.get(id=user_id)

        response = {'message': 'User data updated successfully', 'reload': False}

        if 'username' in data:
            user.username = data['username']
            user.email = data['email']
            user.password = data['password']
            user.save()

        if 'email_notifications' in data:
            notification_setting = NotificationSettings.objects.get(id=user.notification_settings.id)
            notification_setting.email_notifications = data['email_notifications']
            notification_setting.push_notifications = data['push_notifications']
            notification_setting.frequency = data['frequency']
            notification_setting.save()

        if 'profile_visibility' in data:
            privacy_setting = PrivacySettings.objects.get(id=user.privacy_settings.id)
            privacy_setting.visibility = data['profile_visibility']
            privacy_setting.data_sharing = data['data_sharing']
            privacy_setting.save()

        if 'theme' in data:
            theme_setting = ThemeSettings.objects.get(id=user.theme_settings.id)
            new_theme = Theme.objects.get(id=data['theme'])
            theme_setting.theme = new_theme
            theme_setting.save()
            response['reload'] = True

        return JsonResponse(response, status=200)

    except ObjectDoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': 'An unexpected error occurred', 'details': str(e)}, status=500)


def get_all_themes(request):
    themes = Theme.objects.all()
    themes_data = [{'id': theme.id, 'value': theme.name} for theme in themes]
    return JsonResponse(themes_data, safe=False)
