# Importer toutes les vues
from .user_views import register_user, user_list
from .product_views import hello_world, item_list, product_list, product_detail
from .client_views import client_list, client_detail
from .commercial_views import commercial_list, commercial_detail, commercial_devis_list
from .devis_views import devis_list, devis_detail, client_devis_list
from .ristourne_views import (
    ristourne_list, ristourne_detail, 
    client_ristournes_list, commercial_ristournes_list
)
from .commande_views import (
    commande_list, commande_detail, 
    client_commandes_list, commandes_by_status
)
from .entrepot_views import (
    entrepot_list, entrepot_detail, produit_entrepots
)
from .vehicule_views import (
    vehicule_list, vehicule_detail,
    vehicule_transports, vehicules_by_status
)
from .livreur_views import (
    livreur_list, livreur_detail,
    livreurs_by_status, livreur_transports,
    assign_vehicle_to_livreur
)
from .livraison_views import (
    livraison_list, livraison_detail,
    commande_livraisons, livraisons_by_statut,
    update_livraison_status
)
from .details_commande_views import (
    details_commande_list, details_commande_detail,
    afficher_details_commande
)
# Séparation des vues de collaborateur et maintenance
from .collaborateur_views import (
    collaborateur_list, collaborateur_detail,
    collaborateurs_by_role
)
from .maintenance_views import (
    maintenance_list, maintenance_detail,
    vehicule_maintenances, collaborateur_maintenances,
    update_maintenance_status, maintenances_by_status
)