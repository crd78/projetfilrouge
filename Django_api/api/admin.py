from django.contrib import admin
from .models import (
    Product, UserProfile, Client, Commercial, Devis, 
    Commande, Ristourne, Fournisseur, Entrepot, StockMouvement,
    Vehicule, Transport, Livreur, Livraison, DetailsCommande,
    Maintenance, Collaborateur  # Nouveaux modèles
)

admin.site.register(Product)
admin.site.register(Client)
admin.site.register(UserProfile)
admin.site.register(Devis)
admin.site.register(Commercial)
admin.site.register(Ristourne)
admin.site.register(Commande)
admin.site.register(Entrepot)
admin.site.register(Fournisseur)
admin.site.register(StockMouvement)
admin.site.register(Vehicule)  
admin.site.register(Transport)
admin.site.register(Livreur)  # Enregistrement du nouveau modèle
admin.site.register(Maintenance)
admin.site.register(Collaborateur)