from django.contrib import admin
from .models import (
    Product, UserProfile, Devis, 
    Commande, Ristourne, Entrepot, StockMouvement,
    Vehicule, Transport, Livraison, DetailsCommande,
    Maintenance,Personne # Nouveaux modèles
)

admin.site.register(Product)
admin.site.register(UserProfile)
admin.site.register(Devis)
admin.site.register(Ristourne)
admin.site.register(Commande)
admin.site.register(Entrepot)
admin.site.register(StockMouvement)
admin.site.register(Vehicule)  
admin.site.register(Transport) 
admin.site.register(Maintenance)
admin.site.register(Personne)
