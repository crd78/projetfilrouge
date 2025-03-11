from django.db import models
from .vehicule import Vehicule

class Livreur(models.Model):
    IdLivreur = models.AutoField(primary_key=True)
    Nom = models.CharField(max_length=100, verbose_name="Nom")
    Prenom = models.CharField(max_length=100, verbose_name="Prénom")
    IdVehicule = models.ForeignKey(
        Vehicule,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='livreurs',
        verbose_name="Véhicule attribué"
    )
    Telephone = models.CharField(max_length=20, verbose_name="Téléphone", blank=True)
    Email = models.EmailField(verbose_name="Email", blank=True)
    Adresse = models.TextField(verbose_name="Adresse", blank=True)
    CodePostal = models.CharField(max_length=10, verbose_name="Code postal", blank=True)
    Ville = models.CharField(max_length=100, verbose_name="Ville", blank=True)
    DateEmbauche = models.DateField(verbose_name="Date d'embauche", null=True, blank=True)
    Statut = models.CharField(
        max_length=20,
        choices=[
            ('ACTIF', 'Actif'),
            ('INACTIF', 'Inactif'),
            ('CONGE', 'En congé'),
            ('MALADE', 'Arrêt maladie')
        ],
        default='ACTIF',
        verbose_name="Statut"
    )
    DateCreation = models.DateTimeField(auto_now_add=True)
    DateMiseAJour = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.Prenom} {self.Nom} (ID: {self.IdLivreur})"
    
    def save(self, *args, **kwargs):
        # Si un véhicule est attribué, mettre son statut à "EN_UTILISATION"
        if self.IdVehicule and self.Statut == 'ACTIF':
            vehicule = self.IdVehicule
            vehicule.Statut = 'EN_UTILISATION'
            vehicule.save()
        
        super().save(*args, **kwargs)
    
    class Meta:
        verbose_name = "Livreur"
        verbose_name_plural = "Livreurs"
        ordering = ['Nom', 'Prenom']