from django.db import models
from .product import Product
from .devis import Devis

class DetailsCommande(models.Model):
    id = models.AutoField(primary_key=True)
    IdCommande = models.IntegerField(verbose_name="ID de la commande", null=True, blank=True)
    IdDevis = models.ForeignKey(Devis, on_delete=models.CASCADE, db_column="IdDevis", null=True, blank=True)
    IdProduit = models.ForeignKey(Product, on_delete=models.CASCADE, db_column="IdProduit")
    Quantite = models.PositiveIntegerField(default=1, verbose_name="Quantité")
    
    def __str__(self):
        return f"Commande {self.IdCommande} - Produit {self.IdProduit} x{self.Quantite}"
    
    class Meta:
        verbose_name = "Détail de commande"
        verbose_name_plural = "Détails de commandes"
        unique_together = ['IdCommande', 'IdProduit']  # Évite les doublons de produit dans la même commande