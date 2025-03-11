from django.db import models

class DetailsCommande(models.Model):
    """Modèle pour représenter les lignes de détail d'une commande"""
    id = models.AutoField(primary_key=True)
    IdCommande = models.IntegerField(verbose_name="ID de la commande")
    IdProduit = models.IntegerField(verbose_name="ID du produit")
    Quantite = models.PositiveIntegerField(default=1, verbose_name="Quantité")
    
    def __str__(self):
        return f"Commande {self.IdCommande} - Produit {self.IdProduit} x{self.Quantite}"
    
    class Meta:
        verbose_name = "Détail de commande"
        verbose_name_plural = "Détails de commandes"
        unique_together = ['IdCommande', 'IdProduit']  # Évite les doublons de produit dans la même commande