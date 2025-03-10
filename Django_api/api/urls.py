from django.urls import path
from .views import hello_world, item_list

urlpatterns = [
    path('hello/', hello_world),
    path('items/', item_list),
]