from django.urls import path

from . import views

urlpatterns = [
    path('themes/', views.get_all_themes),
    path('user-data/<int:user_id>/', views.get_user_data),
    path('user-data/username/', views.get_username_availability),
    path('user-data/update/', views.update_user_data)
]
