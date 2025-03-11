from django.urls import path
from .views import (
    hello_world, item_list, product_list,
    register_user, user_list,
    client_list, client_detail,
    devis_list, devis_detail, client_devis_list,
    commercial_list, commercial_detail, commercial_devis_list,
    ristourne_list, ristourne_detail, client_ristournes_list, commercial_ristournes_list
)
urlpatterns = [
    # Routes générales
    path('hello/', hello_world),
    path('items/', item_list),
    path('products/', product_list),
    
    # Routes utilisateurs
    path('users/register/', register_user),
    path('users/', user_list),
    
    # Routes clients
    path('clients/', client_list),
    path('clients/<int:pk>/', client_detail),
    
    # Routes devis
    path('devis/', devis_list),
    path('devis/<int:pk>/', devis_detail),
    path('clients/<int:client_id>/devis/', client_devis_list),
    
    # Routes commerciaux
    path('commerciaux/', commercial_list),
    path('commerciaux/<int:pk>/', commercial_detail),
    path('commerciaux/<int:commercial_id>/devis/', commercial_devis_list),

    # Routes ristourne
    path('ristournes/', ristourne_list),
    path('ristournes/<int:pk>/', ristourne_detail),
    path('clients/<int:client_id>/ristournes/', client_ristournes_list),
    path('commerciaux/<int:commercial_id>/ristournes/', commercial_ristournes_list),
]