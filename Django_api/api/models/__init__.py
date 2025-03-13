# Import tous les modèles pour qu'ils soient accessibles via api.models
from .product import Product
from .user import UserProfile
from .client import Client
from .commercial import Commercial
from .devis import Devis
from .commande import Commande
from .stock import StockMouvement
from .fournisseur import Fournisseur
from .ristourne import Ristourne  # Import from ristourne.py instead of fournisseur.py
from .entrepot import Entrepot
from .vehicule import Vehicule
from .transport import Transport
from .livreur import Livreur
from .livraison import Livraison
from .detailCommande import DetailsCommande
from .collaborateur import Collaborateur
from .maintenance import Maintenance

# Pour pouvoir utiliser les modèles ailleurs comme:
# from api.models import Product, Client, etc.