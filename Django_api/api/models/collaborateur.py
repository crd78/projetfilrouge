from django.db import models

class Collaborateur(models.Model):
    """Modèle pour représenter les collaborateurs"""
    ROLE_CHOICES = [
        ('TECHNICIEN', 'Technicien'),
        ('MECANICIEN', 'Mécanicien'),
        ('ELECTRICIEN', 'Électricien'),
        ('CARROSSIER', 'Carrossier'),
        ('ADMINISTRATIF', 'Administratif'),
        ('AUTRE', 'Autre'),
    ]
    
    IdCollaborateur = models.AutoField(primary_key=True)
    Nom = models.CharField(max_length=100, verbose_name="Nom")
    Prenom = models.CharField(max_length=100, verbose_name="Prénom")
    Role = models.CharField(
        max_length=20, 
        choices=ROLE_CHOICES,
        default='TECHNICIEN',
        verbose_name="Rôle"
    )
    
    def __str__(self):
        return f"{self.Prenom} {self.Nom} - {self.Role}"
    
    class Meta:
        verbose_name = "Collaborateur"
        verbose_name_plural = "Collaborateurs"
        ordering = ['Nom', 'Prenom']