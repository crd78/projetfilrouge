from django.urls import path
from .views import (
    hello_world, item_list, product_list, product_detail,
    register_user, user_list,
    personne_list, personne_detail,
    devis_list, devis_detail, client_devis_list,
    commercial_devis_list, ristourne_list, ristourne_detail, commercial_ristournes_list,
    commande_list, commande_detail, client_commandes_list, commandes_by_status,
    entrepot_list, entrepot_detail, produit_entrepots,
    vehicule_list, vehicule_detail, vehicule_transports, vehicules_by_status,
    livraison_list, livraison_detail, commande_livraisons, livraisons_by_statut, update_livraison_status,
    details_commande_list, details_commande_detail, afficher_details_commande,
    maintenance_list, maintenance_detail, vehicule_maintenances, collaborateur_maintenances,
    update_maintenance_status, maintenances_by_status
)
from .views.ristourne_views import devis_ristournes_list

urlpatterns = [
    # Routes générales
    path('hello/', hello_world),
    path('items/', item_list),
    path('products/', product_list),
    path('products/<int:pk>/', product_detail),
    
    # Routes utilisateurs
    path('users/register/', register_user),
    path('users/', user_list),
    
    # Routes pour Personne (fusion de Client, Commercial, Livreur, Fournisseur, Collaborateur)
    path('personnes/', personne_list),
    path('personnes/<int:pk>/', personne_detail),
    
    # Autres routes
    path('devis/', devis_list),
    path('devis/<int:pk>/', devis_detail),
    path('clients/<int:client_id>/devis/', client_devis_list),
    path('commerciaux/<int:commercial_id>/devis/', commercial_devis_list),
    
    path('ristournes/', ristourne_list),
    path('ristournes/<int:pk>/', ristourne_detail),
    path('devis/<int:devis_id>/ristournes/', devis_ristournes_list),
    path('commerciaux/<int:commercial_id>/ristournes/', commercial_ristournes_list),

    path('commandes/', commande_list),
    path('commandes/<int:pk>/', commande_detail),
    path('clients/<int:client_id>/commandes/', client_commandes_list),
    path('commandes/statut/<str:statut>/', commandes_by_status),

    path('entrepots/', entrepot_list),
    path('entrepots/<int:pk>/', entrepot_detail),
    path('products/<int:produit_id>/entrepots/', produit_entrepots),

    path('vehicules/', vehicule_list),
    path('vehicules/<int:pk>/', vehicule_detail),
    path('vehicules/<int:vehicule_id>/transports/', vehicule_transports),
    path('vehicules/statut/<str:status_value>/', vehicules_by_status),

    path('livraisons/', livraison_list),
    path('livraisons/<int:pk>/', livraison_detail),
    path('commandes/<int:commande_id>/livraisons/', commande_livraisons),
    path('livraisons/statut/<str:statut>/', livraisons_by_statut),
    path('livraisons/<int:pk>/statut/<str:statut>/', update_livraison_status),

    path('details-commandes/', details_commande_list),
    path('details-commandes/<int:pk>/', details_commande_detail),
    path('commandes/<int:commande_id>/details/', afficher_details_commande),


    path('maintenances/', maintenance_list),
    path('maintenances/<int:pk>/', maintenance_detail),
    path('vehicules/<int:vehicule_id>/maintenances/', vehicule_maintenances),
    path('collaborateurs/<int:collaborateur_id>/maintenances/', collaborateur_maintenances),
    path('maintenances/<int:pk>/statut/<str:statut>/', update_maintenance_status),
    path('maintenances/statut/<str:statut>/', maintenances_by_status),
]