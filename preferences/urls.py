from django.urls import path
from django.views.generic import RedirectView

from . import views

urlpatterns = [
    path('account-settings/', views.index),
    path('', RedirectView.as_view(url='account-settings'))
]
