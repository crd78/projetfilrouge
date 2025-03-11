from django.urls import path
from .views import (
    hello_world, item_list, product_list, product_detail,
    register_user, user_list,
    client_list, client_detail,
    devis_list, devis_detail, client_devis_list,
    commercial_list, commercial_detail, commercial_devis_list,
    ristourne_list, ristourne_detail, client_ristournes_list, commercial_ristournes_list,
    commande_list, commande_detail, client_commandes_list, commandes_by_status,
    entrepot_list, entrepot_detail, produit_entrepots,
    vehicule_list, vehicule_detail, vehicule_transports, vehicules_by_status,
    livreur_list, livreur_detail, livreurs_by_status, livreur_transports, assign_vehicle_to_livreur,
    # Nouvelles routes
    livraison_list, livraison_detail, commande_livraisons, 
    livraisons_by_statut, update_livraison_status,
    # Import details_commande views
    details_commande_list, details_commande_detail, afficher_details_commande,
    collaborateur_list, collaborateur_detail, collaborateurs_by_role,
    maintenance_list, maintenance_detail,
    vehicule_maintenances, collaborateur_maintenances,
    update_maintenance_status, maintenances_by_status
)

urlpatterns = [
    # Routes générales
    path('hello/', hello_world),
    path('items/', item_list),
    path('products/', product_list),
    path('products/<int:pk>/', product_detail),
    
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

    # Routes commandes
    path('commandes/', commande_list),
    path('commandes/<int:pk>/', commande_detail),
    path('clients/<int:client_id>/commandes/', client_commandes_list),
    path('commandes/statut/<str:statut>/', commandes_by_status),

    # Routes entrepôts
    path('entrepots/', entrepot_list),
    path('entrepots/<int:pk>/', entrepot_detail),
    path('products/<int:produit_id>/entrepots/', produit_entrepots),

    # Routes véhicules
    path('vehicules/', vehicule_list),
    path('vehicules/<int:pk>/', vehicule_detail),
    path('vehicules/<int:vehicule_id>/transports/', vehicule_transports),
    path('vehicules/statut/<str:status_value>/', vehicules_by_status),
    
    # Routes livreurs
    path('livreurs/', livreur_list),
    path('livreurs/<int:pk>/', livreur_detail),
    path('livreurs/statut/<str:status_value>/', livreurs_by_status),
    path('livreurs/<int:livreur_id>/transports/', livreur_transports),
    path('livreurs/<int:livreur_id>/assigner-vehicule/<int:vehicule_id>/', assign_vehicle_to_livreur),

    # Routes livraisons
    path('livraisons/', livraison_list),
    path('livraisons/<int:pk>/', livraison_detail),
    path('commandes/<int:commande_id>/livraisons/', commande_livraisons),
    path('livraisons/statut/<str:statut>/', livraisons_by_statut),
    path('livraisons/<int:pk>/statut/<str:statut>/', update_livraison_status),

    # Routes détails commandes
    path('details-commandes/', details_commande_list),
    path('details-commandes/<int:pk>/', details_commande_detail),
    path('commandes/<int:commande_id>/details/', afficher_details_commande),

    # Routes collaborateurs (sans duplication)
    path('collaborateurs/', collaborateur_list),
    path('collaborateurs/<int:pk>/', collaborateur_detail),
    path('collaborateurs/role/<str:role>/', collaborateurs_by_role),
    
    # Routes maintenances
    path('maintenances/', maintenance_list),
    path('maintenances/<int:pk>/', maintenance_detail),
    path('vehicules/<int:vehicule_id>/maintenances/', vehicule_maintenances),
    path('collaborateurs/<int:collaborateur_id>/maintenances/', collaborateur_maintenances),
    path('maintenances/<int:pk>/statut/<str:statut>/', update_maintenance_status),
    path('maintenances/statut/<str:statut>/', maintenances_by_status),
]