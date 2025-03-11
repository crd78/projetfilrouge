from django.db import models

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