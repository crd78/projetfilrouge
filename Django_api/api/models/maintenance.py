from django.db import models
from .vehicule import Vehicule
from .personne import Personne  # Remplace Collaborateur par Personne

class Maintenance(models.Model):
    TYPE_CHOICES = [
        ('PREVENTIVE', 'Préventive'),
        ('CORRECTIVE', 'Corrective'),
        ('REVISION', 'Révision périodique'),
        ('REPARATION', 'Réparation'),
        ('AUTRE', 'Autre'),
    ]
    
    STATUS_CHOICES = [
        ('PLANIFIEE', 'Planifiée'),
        ('EN_COURS', 'En cours'),
        ('TERMINEE', 'Terminée'),
        ('ANNULEE', 'Annulée'),
    ]
    
    IdMaintenance = models.AutoField(primary_key=True)
    IdCollaborateur = models.ForeignKey(
        Personne,  # Utiliser Personne pour représenter le collaborateur
        on_delete=models.SET_NULL,
        null=True,
        related_name='maintenances',
        verbose_name="Technicien responsable"
    )
    DateMaintenance = models.DateTimeField(verbose_name="Date de maintenance")
    IdVehicule = models.ForeignKey(
        Vehicule,
        on_delete=models.CASCADE,
        related_name='maintenances',
        verbose_name="Véhicule"
    )
    TypeMaintenance = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default='REVISION',
        verbose_name="Type de maintenance"
    )
    Description = models.TextField(verbose_name="Description des travaux", blank=True)
    CoutMaintenance = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True, 
        blank=True,
        verbose_name="Coût de la maintenance"
    )
    KilometrageVehicule = models.IntegerField(
        verbose_name="Kilométrage du véhicule",
        null=True,
        blank=True
    )
    DureeMaintenance = models.IntegerField(
        verbose_name="Durée de la maintenance (heures)",
        null=True,
        blank=True
    )
    StatutMaintenance = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PLANIFIEE',
        verbose_name="Statut de la maintenance"
    )
    DateFinMaintenance = models.DateTimeField(
        verbose_name="Date de fin de maintenance",
        null=True,
        blank=True
    )
    DateCreation = models.DateTimeField(auto_now_add=True)
    DateMiseAJour = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Maintenance #{self.IdMaintenance} - {self.IdVehicule} - {self.DateMaintenance.strftime('%d/%m/%Y')}"
    
    def save(self, *args, **kwargs):
        if self.StatutMaintenance == 'TERMINEE' and self.DateFinMaintenance:
            vehicule = self.IdVehicule
            vehicule.LastDateMaintenance = self.DateFinMaintenance.date()
            vehicule.save(update_fields=['LastDateMaintenance'])
            if vehicule.Statut == 'EN_MAINTENANCE':
                vehicule.Statut = 'DISPONIBLE'
        super().save(*args, **kwargs)
    
    class Meta:
        verbose_name = "Maintenance"
        verbose_name_plural = "Maintenances"