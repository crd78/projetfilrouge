from django.db import models
from .product import Product
from .commande import Commande
from .personne import Personne  # Remplace Fournisseur par Personne

class StockMouvement(models.Model):
    TYPE_CHOICES = [
        ('ENTREE', 'Entrée'),
        ('SORTIE', 'Sortie'),
        ('RETOUR', 'Retour'),
        ('AJUSTEMENT', 'Ajustement'),
        ('INVENTAIRE', 'Inventaire'),
    ]
    
    IdMouvement = models.AutoField(primary_key=True)
    IdProduit = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='mouvements_stock',
        verbose_name="Produit"
    )
    IdEntrepot = models.ForeignKey(
        'api.Entrepot',  # Référence par chaîne pour éviter l'import circulaire
        on_delete=models.CASCADE,
        related_name='mouvements_stock',
        verbose_name="Entrepôt"
    )
    DateMouvement = models.DateTimeField(auto_now_add=True, verbose_name="Date du mouvement")
    Quantite = models.IntegerField(verbose_name="Quantité")
    TypeMouvement = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default='ENTREE',
        verbose_name="Type de mouvement"
    )
    IdCommande = models.ForeignKey(
        Commande,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='mouvements_stock',
        verbose_name="Commande associée"
    )
    IdFournisseur = models.ForeignKey(
        Personne,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='mouvements_stock_fournisseur',
        verbose_name="Fournisseur",
        limit_choices_to={'role': 4}  # Limiter aux personnes ayant le rôle Fournisseur
    )
    Commentaire = models.TextField(blank=True, verbose_name="Commentaire")
    
    def __str__(self):
        mouvement_type = "+" if self.TypeMouvement == "ENTREE" else "-"
        from .entrepot import Entrepot  # Import à l'intérieur pour éviter l'import circulaire
        entrepot = Entrepot.objects.get(pk=self.IdEntrepot_id)
        return f"{self.DateMouvement.strftime('%Y-%m-%d')} - {mouvement_type}{self.Quantite} {self.IdProduit.NomProduit} ({entrepot.Localisation})"
    
    def save(self, *args, **kwargs):
        # Mise à jour de la quantité en stock du produit lors d'un mouvement
        produit = self.IdProduit
        
        # Ajout ou soustraction selon le type de mouvement
        if self.TypeMouvement in ['ENTREE', 'RETOUR']:
            produit.QuantiteStock += self.Quantite
        elif self.TypeMouvement in ['SORTIE']:
            produit.QuantiteStock -= self.Quantite
        elif self.TypeMouvement == 'AJUSTEMENT':
            # Pour un ajustement, on ne fait rien ici car c'est une modification directe
            pass
        elif self.TypeMouvement == 'INVENTAIRE':
            # Pour un inventaire, on remplace directement la quantité
            produit.QuantiteStock = self.Quantite
        
        produit.save()
        # Mise à jour de l'IdMouvement dans le produit
        produit.IdMouvement = self.IdMouvement
        produit.save(update_fields=['IdMouvement'])
        
        super().save(*args, **kwargs)
    
    class Meta:
        verbose_name = "Mouvement de stock"
        verbose_name_plural = "Mouvements de stock"
        ordering = ['-DateMouvement']