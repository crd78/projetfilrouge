from django.db import models
from .vehicule import Vehicule

class Transport(models.Model):
    IdTransport = models.AutoField(primary_key=True)
    CoutKilometre = models.DecimalField(
        max_digits=6, 
        decimal_places=2, 
        verbose_name="Coût au kilomètre (€)"
    )
    FraisFixes = models.DecimalField(
        max_digits=8, 
        decimal_places=2, 
        verbose_name="Frais fixes (€)"
    )
    IdVehicule = models.ForeignKey(
        Vehicule,
        on_delete=models.CASCADE,
        related_name='transports',
        verbose_name="Véhicule"
    )
    DateDebut = models.DateTimeField(verbose_name="Date de début", null=True, blank=True)
    DateFin = models.DateTimeField(verbose_name="Date de fin", null=True, blank=True)
    Distance = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        verbose_name="Distance (km)",
        null=True,
        blank=True
    )
    CoutTotal = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Coût total (€)",
        null=True,
        blank=True
    )
    CommissionChauffeur = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        verbose_name="Commission chauffeur (%)",
        null=True,
        blank=True
    )
    Commentaire = models.TextField(blank=True, verbose_name="Commentaire")
    DateCreation = models.DateTimeField(auto_now_add=True)
    DateMiseAJour = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Transport #{self.IdTransport} - {self.IdVehicule}"
    
    def save(self, *args, **kwargs):
        # Calculer le coût total si la distance est renseignée
        if self.Distance is not None:
            self.CoutTotal = (self.CoutKilometre * self.Distance) + self.FraisFixes
        
        super().save(*args, **kwargs)
    
    class Meta:
        verbose_name = "Transport"
        verbose_name_plural = "Transports"
        ordering = ['-DateCreation']