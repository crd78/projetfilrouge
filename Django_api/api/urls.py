from django.urls import path
from .views import hello_world, item_list, product_list, register_user, user_list

urlpatterns = [
    path('hello/', hello_world),
    path('items/', item_list),
    path('products/', product_list),
    path('users/register/', register_user),
    path('users/', user_list),
]