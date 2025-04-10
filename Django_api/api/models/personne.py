from django.db import models

class Personne(models.Model):
    # Définition des rôles, ajout de Fournisseur (valeur 5)
    ROLE_CHOICES = [
        (1, 'Client'),
        (2, 'Commercial'),
        (3, 'Livreur'),
        (4, 'Collaborateur'),
        (5, 'Fournisseur'),
    ]
    
    id = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100, verbose_name="Nom")
    prenom = models.CharField(max_length=100, verbose_name="Prénom")
    telephone = models.CharField(max_length=20, blank=True, verbose_name="Téléphone")
    email = models.EmailField(blank=True, verbose_name="Email")
    adresse = models.TextField(blank=True, verbose_name="Adresse")
    role = models.IntegerField(choices=ROLE_CHOICES, verbose_name="Rôle")
    
    # Champs spécifiques aux fournisseurs
    fonction = models.CharField(max_length=100, blank=True, verbose_name="Fonction")
    code_postal = models.CharField(max_length=10, blank=True, verbose_name="Code Postal")
    ville = models.CharField(max_length=100, blank=True, verbose_name="Ville")
    raison_sociale = models.CharField(max_length=200, blank=True, verbose_name="Raison Sociale")
    siret = models.CharField(max_length=14, blank=True, verbose_name="SIRET")
    
    date_creation = models.DateTimeField(auto_now_add=True)
    date_miseajour = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        if self.role == 5 and self.raison_sociale:
            return self.raison_sociale
        return f"{self.prenom} {self.nom} - {self.get_role_display()}"
    
    class Meta:
        verbose_name = "Personne"
        verbose_name_plural = "Personnes"