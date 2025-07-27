from django.db import models

class Product(models.Model):
    TYPE_CHOICES = [
        ('Farines', 'Farines'),
        ('Produits laitiers', 'Produits laitiers'),
        ('Ingrédient', 'Ingrédient'),
        ('AUTRE', 'Autre'),
    ]
    
    IdProduit = models.AutoField(primary_key=True)
    NomProduit = models.CharField(max_length=100, verbose_name="Nom du produit")
    TypeProduit = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default='AUTRE',
        verbose_name="Type de produit"
    )
    PrixHT = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        verbose_name="Prix HT"
    )
    PrixTTC = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        verbose_name="Prix TTC"
    )
   
    IdMouvement = models.PositiveIntegerField(blank=True, null=True, verbose_name="ID de mouvement")
    DateCreation = models.DateTimeField(auto_now_add=True)
    DateMiseAJour = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.NomProduit
    
    class Meta:
        app_label = 'api'
        verbose_name = "Produit"
        verbose_name_plural = "Produits"

