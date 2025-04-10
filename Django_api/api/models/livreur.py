from django.db import models

class Livreur(models.Model):
    IdLivreur = models.AutoField(primary_key=True)
    Nom = models.CharField(max_length=100, verbose_name="Nom")
    Prenom = models.CharField(max_length=100, verbose_name="Prénom")
    Telephone = models.CharField(max_length=20, blank=True, verbose_name="Téléphone")
    Email = models.EmailField(blank=True, verbose_name="Email")
    Adresse = models.TextField(blank=True, verbose_name="Adresse")
    CodePostal = models.CharField(max_length=10, blank=True, verbose_name="Code postal")
    Ville = models.CharField(max_length=100, blank=True, verbose_name="Ville")
    DateEmbauche = models.DateField(blank=True, null=True, verbose_name="Date d'embauche")
    Statut = models.CharField(
        max_length=20,
        choices=[('ACTIF', 'Actif'), ('INACTIF', 'Inactif'), ('CONGE', 'En congé'), ('MALADE', 'Arrêt maladie')],
        default='ACTIF',
        verbose_name="Statut"
    )
    DateCreation = models.DateTimeField(auto_now_add=True)
    DateMiseAJour = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.Prenom} {self.Nom} - {self.Statut}"
    
    class Meta:
        verbose_name = "Livreur"
        verbose_name_plural = "Livreurs"