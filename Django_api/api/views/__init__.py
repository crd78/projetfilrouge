# Importer toutes les vues
from .user_views import register_user, user_list
from .product_views import hello_world, item_list, product_list
from .client_views import client_list, client_detail
from .commercial_views import commercial_list, commercial_detail, commercial_devis_list
from .devis_views import devis_list, devis_detail, client_devis_list
from .ristourne_views import (
    ristourne_list, ristourne_detail, 
    client_ristournes_list, commercial_ristournes_list
)