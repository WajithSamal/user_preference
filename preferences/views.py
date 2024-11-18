import json
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from api.models import UserData


# Create your views here.
@csrf_exempt
def index(request):
    try:
        user = UserData.objects.get(id=1)
        theme = user.theme_settings.theme.file_name
        css_file = f'preferences/styles/webix/{theme}.css'
        return render(request, 'preferences/index.html', {
            'css_file': css_file
        })


    except Exception as e:
        print(e)
        return render(request, 'preferences/index.html', {
            'css_file': 'preferences/styles/webix/material.css'
        })
