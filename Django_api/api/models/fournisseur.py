from django.db import models
from .client import Client
from .commercial import Commercial

class Fournisseur(models.Model):
    IdFournisseur = models.AutoField(primary_key=True)
    NomContact = models.CharField(max_length=100, verbose_name="Nom du contact")
    PrenomContact = models.CharField(max_length=100, verbose_name="Prénom du contact")
    Fonction = models.CharField(max_length=100, blank=True, verbose_name="Fonction")
    CodePostal = models.CharField(max_length=10, verbose_name="Code postal")
    Ville = models.CharField(max_length=100, verbose_name="Ville")
    Adresse = models.TextField(verbose_name="Adresse")
    Telephone = models.CharField(max_length=20, verbose_name="Téléphone")
    Email = models.EmailField(verbose_name="Email")
    RaisonSociale = models.CharField(max_length=200, verbose_name="Raison sociale")
    SIRET = models.CharField(max_length=14, blank=True, verbose_name="SIRET")
    DateCreation = models.DateTimeField(auto_now_add=True)
    DateMiseAJour = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.RaisonSociale
    
    class Meta:
        verbose_name = "Fournisseur"
        verbose_name_plural = "Fournisseurs"

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
        ordering = ['-DateRistourne']