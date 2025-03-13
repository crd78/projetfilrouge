from django.db import models
from .devis import Devis
from .commercial import Commercial

class Ristourne(models.Model):
    idRistourne = models.AutoField(primary_key=True)
    DateRistourne = models.DateField(verbose_name="Date de la ristourne")
    IdDevis = models.ForeignKey(
        Devis,
        on_delete=models.CASCADE,
        related_name='ristournes',
        verbose_name="Devis"
    )
    IdCommercial = models.ForeignKey(
        Commercial,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='ristournes_accordees',
        verbose_name="Commercial"
    )
    MontantRistourne = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name="Montant de la ristourne"
    )
    Commentaire = models.TextField(blank=True, verbose_name="Commentaire")
    
    def __str__(self):
        return f"Ristourne #{self.idRistourne} - Devis #{self.IdDevis.IdDevis} - {self.DateRistourne}"
    
    class Meta:
        verbose_name = "Ristourne"
        verbose_name_plural = "Ristournes"
        ordering = ['-DateRistourne']