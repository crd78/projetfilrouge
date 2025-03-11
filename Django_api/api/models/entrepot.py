from django.db import models
from .product import Product

class Entrepot(models.Model):
    IdEntrepot = models.AutoField(primary_key=True)
    IdProduit = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='entrepots',
        verbose_name="Produit associé"
    )
    Localisation = models.CharField(max_length=255, verbose_name="Localisation de l'entrepôt")
    CapaciteStock = models.PositiveIntegerField(default=0, verbose_name="Capacité de stockage")
    IdMouvement = models.ForeignKey(
        'api.StockMouvement',  # Utilisation d'une référence par chaîne pour éviter l'import circulaire
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='entrepots_associes',
        verbose_name="Dernier mouvement associé"
    )
    DateCreation = models.DateTimeField(auto_now_add=True)
    DateMiseAJour = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Entrepôt #{self.IdEntrepot} - {self.Localisation} - Produit: {self.IdProduit.NomProduit}"
    
    class Meta:
        verbose_name = "Entrepôt"
        verbose_name_plural = "Entrepôts"
        unique_together = ['IdEntrepot', 'IdProduit'] # Évite les doublons de produit dans le même entrepôt