from django.db import models
from .commande import Commande
from .transport import Transport
from .entrepot import Entrepot
from .vehicule import Vehicule

class Livraison(models.Model):
    STATUT_CHOICES = [
        ('ATTENTE', 'En attente'),
        ('PREPARATION', 'En préparation'),
        ('EN_COURS', 'En cours de livraison'),
        ('LIVREE', 'Livrée'),
        ('RETOURNEE', 'Retournée'),
        ('ANNULEE', 'Annulée'),
    ]
    
    IdLivraison = models.AutoField(primary_key=True)
    IdCommande = models.ForeignKey(
        Commande,
        on_delete=models.CASCADE,
        related_name='livraisons',
        verbose_name="Commande"
    )
    IdTransport = models.ForeignKey(
        Transport,
        on_delete=models.CASCADE,
        related_name='livraisons',
        verbose_name="Transport"
    )
    Statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default='ATTENTE',
        verbose_name="Statut de la livraison"
    )
    IdEntrepot = models.ForeignKey(
        Entrepot,
        on_delete=models.CASCADE,
        related_name='livraisons',
        verbose_name="Entrepôt source"
    )
    IdVehicule = models.ForeignKey(
        Vehicule,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='livraisons',
        verbose_name="Véhicule"
    )
    DatePrevue = models.DateTimeField(verbose_name="Date prévue de livraison", null=True, blank=True)
    DateLivraison = models.DateTimeField(verbose_name="Date de livraison effective", null=True, blank=True)
    Commentaire = models.TextField(blank=True, verbose_name="Commentaire")
    DateCreation = models.DateTimeField(auto_now_add=True)
    DateMiseAJour = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Livraison #{self.IdLivraison} - Commande #{self.IdCommande.IdCommande} - {self.Statut}"
    
    def save(self, *args, **kwargs):
        print(f"DEBUG Statut avant save: {self.Statut}")  # Ajoute ceci pour voir la valeur
        commande = self.IdCommande
        if self.Statut == 'LIVREE':
            commande.Statut = 'LIVREE'
            commande.save(update_fields=['Statut'])
        elif self.Statut == 'EN_COURS':
            commande.Statut = 'EN_COURS'
            commande.save(update_fields=['Statut'])
        elif self.Statut == 'ANNULEE':
            commande.Statut = 'ANNULEE'
            commande.save(update_fields=['Statut'])
        super().save(*args, **kwargs)
     
    
    class Meta:
        verbose_name = "Livraison"
        verbose_name_plural = "Livraisons"
        ordering = ['-DateCreation']