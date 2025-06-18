from django.db import models

class Vehicule(models.Model):
    STATUT_CHOICES = [
        ('DISPONIBLE', 'Disponible'),
        ('EN_UTILISATION', 'En utilisation'),
        ('EN_MAINTENANCE', 'En maintenance'),
        ('HORS_SERVICE', 'Hors service'),
    ]
    
    TYPE_CHOICES = [
        ('CAMION', 'Camion'),
        ('UTILITAIRE', 'Utilitaire'),
        ('VOITURE', 'Voiture'),
        ('MOTO', 'Moto'),
        ('AUTRE', 'Autre'),
    ]
    
    IdVehicule = models.AutoField(primary_key=True)
    TypeVehicule = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default='CAMION',
        verbose_name="Type de véhicule"
    )
    Statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default='DISPONIBLE',
        verbose_name="Statut du véhicule"
    )
    IdMaintenance = models.ForeignKey(
        'Maintenance',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Dernière maintenance"
    )
    Immatriculation = models.CharField(max_length=20, verbose_name="Immatriculation", blank=True)
    DateCreation = models.DateTimeField(auto_now_add=True)
    DateMiseAJour = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.TypeVehicule} #{self.IdVehicule} - {self.Statut}"
    
    class Meta:
        verbose_name = "Véhicule"
        verbose_name_plural = "Véhicules"