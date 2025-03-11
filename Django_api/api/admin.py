from django.contrib import admin
from .models import Product, UserProfile, Client, Devis, Commercial, Ristourne

admin.site.register(Product)
admin.site.register(Client)
admin.site.register(UserProfile)
admin.site.register(Devis)
admin.site.register(Commercial)
admin.site.register(Ristourne)