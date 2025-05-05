from django.db import models
from .personne import Personne

class Devis(models.Model):
    IdDevis = models.AutoField(primary_key=True)
    IdClient = models.ForeignKey(
        Personne,
        on_delete=models.CASCADE,
        related_name='devis',
        verbose_name="Client"
    )
    idCommercial = models.ForeignKey(
        Personne,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='devis_crees',
        verbose_name="Commercial"
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
    DateCreation = models.DateTimeField(auto_now_add=True)
    DateMiseAJour = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Devis #{self.IdDevis} - {self.IdClient.prenom} {self.IdClient.nom}"
    
    class Meta:
        verbose_name = "Devis"
        verbose_name_plural = "Devis"