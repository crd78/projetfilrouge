from django.db import models
from django.contrib.auth.models import User

class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.user.username}'s profile"

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

class Commercial(models.Model):
    idCommercial = models.AutoField(primary_key=True)
    Nom = models.CharField(max_length=100)
    Prenom = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.Prenom} {self.Nom}"
    
    class Meta:
        verbose_name = "Commercial"
        verbose_name_plural = "Commerciaux"

class Devis(models.Model):
    IdDevis = models.AutoField(primary_key=True)
    IdClient = models.ForeignKey(
        Client, 
        on_delete=models.CASCADE,
        related_name='devis',
        verbose_name="Client"
    )
    idCommercial = models.ForeignKey(
        Commercial,
        on_delete=models.SET_NULL,  # Si un commercial est supprimé, le devis reste
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
        return f"Devis #{self.IdDevis} - {self.IdClient.Nom} {self.IdClient.Prenom}"
    
    class Meta:
        verbose_name = "Devis"
        verbose_name_plural = "Devis"

class Ristourne(models.Model):
    idRistourne = models.AutoField(primary_key=True)
    DateRistourne = models.DateField(verbose_name="Date de la ristourne")
    IdClient = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name='ristournes',
        verbose_name="Client"
    )
    IdCommercial = models.ForeignKey(
        Commercial,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='ristournes_accordees',
        verbose_name="Commercial"
    )
    Montant = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name="Montant de la ristourne"
    )
    Commentaire = models.TextField(blank=True, verbose_name="Commentaire")
    
    def __str__(self):
        return f"Ristourne #{self.idRistourne} - {self.IdClient.Nom} {self.IdClient.Prenom} - {self.DateRistourne}"
    
    class Meta:
        verbose_name = "Ristourne"
        verbose_name_plural = "Ristournes"
        ordering = ['-DateRistourne']  # Trie par date du plus récent au plus ancien
