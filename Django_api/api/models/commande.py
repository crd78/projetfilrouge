from django.db import models
from .personne import Personne

class Commande(models.Model):
    STATUT_CHOICES = [
        ('EN_ATTENTE', 'En attente'),
        ('EN_COURS', 'En cours'),
        ('EXPEDIEE', 'Expédiée'),
        ('LIVREE', 'Livrée'),
        ('ANNULEE', 'Annulée'),
    ]
    
    IdCommande = models.AutoField(primary_key=True)
    IdClient = models.ForeignKey(
        Personne,
        on_delete=models.CASCADE,
        related_name='commandes',
        verbose_name="Client"
    )
    DateCommande = models.DateTimeField(auto_now_add=True, verbose_name="Date de la commande")
    Statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default='EN_ATTENTE',
        verbose_name="Statut de la commande"
    )
    MontantTotalHT = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        verbose_name="Montant total HT"
    )
    MontantTotalTTC = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        verbose_name="Montant total TTC"
    )
    EstPayee = models.BooleanField(default=False, verbose_name="Est payée")  # Nouveau champ
    DatePaiement = models.DateTimeField(null=True, blank=True, verbose_name="Date de paiement")  # Nouveau champ
    DateMiseAJour = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Commande #{self.IdCommande} - {self.IdClient.prenom} {self.IdClient.nom} - {self.Statut}"
    
    class Meta:
        verbose_name = "Commande"
        verbose_name_plural = "Commandes"
        ordering = ['-DateCommande']