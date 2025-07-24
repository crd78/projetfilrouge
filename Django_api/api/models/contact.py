from django.db import models
from django.utils import timezone

class Contact(models.Model):
    nom = models.CharField(max_length=100, verbose_name="Nom")
    prenom = models.CharField(max_length=100, verbose_name="Prénom")
    email = models.EmailField(verbose_name="Email")
    telephone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Téléphone")
    sujet = models.CharField(max_length=200, verbose_name="Sujet")
    message = models.TextField(verbose_name="Message")
    date_creation = models.DateTimeField(default=timezone.now, verbose_name="Date de création")
    traite = models.BooleanField(default=False, verbose_name="Traité")
    
    class Meta:
        verbose_name = "Contact"
        verbose_name_plural = "Contacts"
        ordering = ['-date_creation']
    
    def __str__(self):
        return f"{self.prenom} {self.nom} - {self.sujet}"