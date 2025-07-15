from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models


class PersonneManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email obligatoire')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class Personne(AbstractBaseUser, PermissionsMixin):
    # Définition des rôles, ajout de Fournisseur (valeur 5)
    ROLE_CHOICES = [
        (1, 'Client'),
        (2, 'Commercial'),
        (3, 'Collaborateur'),
        (4, 'Fournisseur'),
        (5, 'ChargéStock'),  
    ]
    
    
    id = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100, verbose_name="Nom")
    prenom = models.CharField(max_length=100, verbose_name="Prénom")
    telephone = models.CharField(max_length=20, blank=True, verbose_name="Téléphone")
    email = models.EmailField(blank=True,unique=True, verbose_name="Email")
    USERNAME_FIELD = 'email'
    password = models.CharField(max_length=128, null=True, blank=True)
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
    objects = PersonneManager()
    def __str__(self):
        if self.role == 4 and self.raison_sociale:
            return self.raison_sociale
        return f"{self.prenom} {self.nom} - {self.get_role_display()}"
    
    class Meta:
        verbose_name = "Personne"
        verbose_name_plural = "Personnes"