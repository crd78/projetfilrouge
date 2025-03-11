from django.db import models

class Client(models.Model):
    IdClient = models.AutoField(primary_key=True)
    Nom = models.CharField(max_length=100)
    Prenom = models.CharField(max_length=100)
    Fonction = models.CharField(max_length=100, blank=True)
    CodePostal = models.CharField(max_length=10)
    Ville = models.CharField(max_length=100)
    Adresse = models.TextField()
    Telephone = models.CharField(max_length=20)
    Email = models.EmailField()
    RaisonSociale = models.CharField(max_length=200, blank=True)
    SIRET = models.CharField(max_length=14, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.Prenom} {self.Nom}"