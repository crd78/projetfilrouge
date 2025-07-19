from django.urls import path

from .views.stockmouvement_view import stockmouvement_list

# Import des vues nécessaires
from .views.product_views import product_list, product_detail
from .views.devis_views import devis_list, devis_detail, devis_accepter
from .views.commande_views import (
    commande_list, commande_detail, commande_payer, commande_livrer,
    commandes_for_stock_manager, creer_livraison_depuis_commande  # <-- Ajouter ces deux
)
from .views.transport_views import transport_create, transport_update_status
from .views.vehicule_views import vehicule_list, vehicule_maintenance, vehicule_detail, vehicule_transports, vehicules_by_status
from .views.statistiques_views import statistiques_visites, statistiques_performances
from .views.stats_views import stats_list, users_list
from .views.personne_views import (
    client_list, client_detail, client_inscription,client_connexion,
    commercial_list, commercial_detail,
    fournisseur_list, fournisseur_detail, fournisseur_update,
    livreur_detail, livreurs_by_status
)
# Import des vues de maintenance
from .views.maintenance_views import (
    maintenance_list, maintenance_detail, vehicule_maintenances,
    collaborateur_maintenances, update_maintenance_status, maintenances_by_status,
    creer_maintenance  # <-- Assure-toi que c'est là
)
# Import des vues de ristourne
from .views.ristourne_views import (
    ristourne_list, ristourne_detail, devis_ristournes_list, commercial_ristournes_list
)
# Import des vues d'entrepôt
from .views.entrepot_views import entrepot_list, entrepot_detail, produit_entrepots
# Import des vues de livraison
from .views.livraison_views import (
    livraison_list, livraison_detail, commande_livraisons, 
    livraisons_by_statut, update_livraison_status,
    livraisons_for_stock_manager  
)
from .views.health_views import health_check, simple_test,test_celery
from .views.contact_views import contact_list, contact_detail, contact_marquer_traite


urlpatterns = [

    path('test-celery/', test_celery),
    path('health-check/', health_check, name='health_check'),
    path('simple-test/', simple_test, name='simple_test'),

    # Client routes
    path('client/inscription', client_inscription, name='client_inscription'),
    path('client/connexion', client_connexion, name='client_connexion'),  # Ajoutez cette ligne
    path('clients/<int:id>/', client_detail, name='client_detail'),  
    path('clients', client_list, name='client-list'),
    
    # Product routes
    path('produits', product_list, name='product_list'),
    path('produits/<int:pk>/', product_detail, name='product_detail'), 
   
    
    # Devis routes
    path('devis', devis_list, name='devis_list'),
    path('devis/<int:id>/', devis_detail, name='devis_detail'),
    path('devis/<int:id>/accepter', devis_accepter, name='devis_accepter'),
    
    # Commandes routes
    path('commandes', commande_list, name='commande_list'),
    path('commandes/<int:id>', commande_detail, name='commande_detail'),
    path('commandes/<int:id>/payer', commande_payer, name='commande_payer'),
    path('commandes/<int:id>/livrer', commande_livrer, name='commande_livrer'),
    
    # Fournisseurs routes (consolidées)
    path('fournisseurs/', fournisseur_list, name='fournisseur_list'),  # GET (liste) et POST (création)
    path('fournisseurs/<int:id>', fournisseur_detail, name='fournisseur_detail'),  # GET, PUT, DELETE
    
    # Transport routes
    path('transport', transport_create, name='transport_create'),
    path('transport/<int:id>/status', transport_update_status, name='transport_update_status'),
    
    # Véhicules routes
    path('vehicules', vehicule_list, name='vehicule_list'),
    path('vehicules/<int:pk>', vehicule_detail, name='vehicule_detail'),
    path('vehicules/<int:id>/maintenir', vehicule_maintenance, name='vehicule_maintenance'),
    path('vehicules/<int:vehicule_id>/transports', vehicule_transports, name='vehicule_transports'),
    path('vehicules/status/<str:status_value>', vehicules_by_status, name='vehicules_by_status'),
    
    # Statistiques routes
    path('statistiques/visites', statistiques_visites, name='statistiques_visites'),
    path('statistiques/performances', statistiques_performances, name='statistiques_performances'),
    

    
    # Maintenance routes
    path('maintenances/creer/', creer_maintenance, name='creer_maintenance'),
    path('vehicules/', vehicule_list, name='vehicule_list'),
    path('maintenances/', maintenance_list, name='maintenance_list'),
    path('maintenances/<int:pk>/', maintenance_detail, name='maintenance_detail'),
    path('maintenances/<int:pk>/status/<str:statut>/', update_maintenance_status, name='update_maintenance_status'),  # <-- Ajoute cette ligne
    path('vehicules/<int:vehicule_id>/maintenances/', vehicule_maintenances, name='vehicule_maintenances'),
    path('collaborateurs/<int:collaborateur_id>/maintenances/', collaborateur_maintenances, name='collaborateur_maintenances'),
    path('maintenances/status/<str:statut>/', maintenances_by_status, name='maintenances_by_status'),
    
    # Ristourne routes
    path('ristournes', ristourne_list, name='ristourne_list'),
    path('ristournes/<int:pk>', ristourne_detail, name='ristourne_detail'),
    path('devis/<int:devis_id>/ristournes', devis_ristournes_list, name='devis_ristournes_list'),
    path('commerciaux/<int:commercial_id>/ristournes', commercial_ristournes_list, name='commercial_ristournes_list'),
    
    # Entrepôt routes
    path('entrepots', entrepot_list, name='entrepot_list'),
    path('entrepots/<int:pk>', entrepot_detail, name='entrepot_detail'),
    path('produits/<int:produit_id>/entrepots', produit_entrepots, name='produit_entrepots'),
    
    # Livraison routes
    path('livraisons', livraison_list, name='livraison_list'),
    path('livraisons/<int:pk>', livraison_detail, name='livraison_detail'),
    path('commandes/<int:commande_id>/livraisons', commande_livraisons, name='commande_livraisons'),
    path('livraisons/status/<str:statut>', livraisons_by_statut, name='livraisons_by_statut'),
    path('livraisons/<int:pk>/status/<str:statut>', update_livraison_status, name='update_livraison_status'),

    path('contacts/', contact_list, name='contact_list'),
    path('contacts/<int:pk>/', contact_detail, name='contact_detail'),
    path('contacts/<int:pk>/traite/', contact_marquer_traite, name='contact_marquer_traite'),
    path('stockmouvements', stockmouvement_list, name='stockmouvement_list'),
    path('stock-manager/commandes/', commandes_for_stock_manager, name='commandes_stock_manager'),
    path('stock-manager/livraisons/', livraisons_for_stock_manager, name='livraisons_stock_manager'),
    path('stock-manager/creer-livraison/', creer_livraison_depuis_commande, name='creer_livraison'),
    
    

    # Statistiques desktop
     path('stats', stats_list, name='stats_list'),
     path('users', users_list, name='users_list'),
]