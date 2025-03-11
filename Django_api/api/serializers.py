from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Product, UserProfile, Client, Commercial, Devis, 
    Commande, Ristourne, Fournisseur, Entrepot, StockMouvement,
    Vehicule, Transport, Livreur, Livraison,
    DetailsCommande, Maintenance, Collaborateur  # Ajout de nouvelles classes
)




class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['IdProduit', 'NomProduit', 'TypeProduit', 'PrixHT', 'PrixTTC', 
                 'QuantiteStock', 'IdMouvement', 'DateCreation', 'DateMiseAJour']
        read_only_fields = ['DateCreation', 'DateMiseAJour']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['phone', 'address']

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    profile = UserProfileSerializer(required=False)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'profile']
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
        
    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        
        # Create user profile
        UserProfile.objects.create(
            user=user,
            phone=profile_data.get('phone', ''),
            address=profile_data.get('address', '')
        )
        
        return user
    

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client       
        fields = ['IdClient', 'Nom', 'Prenom', 'Fonction', 'CodePostal', 'Ville', 
                   'Adresse', 'Telephone', 'Email', 'RaisonSociale', 'SIRET', 
                   'created_at', 'updated_at']

class CommercialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commercial
        fields = ['idCommercial', 'Nom', 'Prenom', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class DevisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Devis
        fields = ['IdDevis', 'IdClient', 'idCommercial', 'MontantTotalHT', 'MontantTotalTTC', 'DateCreation', 'DateMiseAJour']
        read_only_fields = ['DateCreation', 'DateMiseAJour']

class RistourneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ristourne
        fields = ['idRistourne', 'DateRistourne', 'IdClient', 'IdCommercial', 'Montant', 'Commentaire']

class CommandeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commande
        fields = ['IdCommande', 'IdClient', 'DateCommande', 'Statut', 
                  'MontantTotalHT', 'MontantTotalTTC', 'DateMiseAJour']
        read_only_fields = ['DateCommande', 'DateMiseAJour']

class EntrepotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrepot
        fields = ['IdEntrepot', 'IdProduit', 'Localisation', 'CapaciteStock', 
                 'IdMouvement', 'DateCreation', 'DateMiseAJour']
        read_only_fields = ['DateCreation', 'DateMiseAJour']

class VehiculeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicule
        fields = ['IdVehicule', 'TypeVehicule', 'Statut', 'LastDateMaintenance', 
                 'Immatriculation', 'DateCreation', 'DateMiseAJour']
        read_only_fields = ['DateCreation', 'DateMiseAJour']

class TransportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transport
        fields = ['IdTransport', 'CoutKilometre', 'FraisFixes', 'IdVehicule',
                 'DateDebut', 'DateFin', 'Distance', 'CoutTotal', 'CommissionChauffeur',
                 'Commentaire', 'DateCreation', 'DateMiseAJour']
        read_only_fields = ['DateCreation', 'DateMiseAJour', 'CoutTotal']

class LivreurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Livreur
        fields = ['IdLivreur', 'Nom', 'Prenom', 'IdVehicule', 
                 'Telephone', 'Email', 'Adresse', 'CodePostal', 'Ville',
                 'DateEmbauche', 'Statut', 'DateCreation', 'DateMiseAJour']
        read_only_fields = ['DateCreation', 'DateMiseAJour']

class DetailsCommandeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetailsCommande
        fields = ['IdCommande', 'IdProduit', 'Quantite']

class LivraisonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Livraison
        fields = ['IdLivraison', 'IdCommande', 'IdTransport', 'Statut',
                 'IdEntrepot', 'IdVehicule', 'DatePrevue', 'DateLivraison',
                 'Commentaire', 'DateCreation', 'DateMiseAJour']
        read_only_fields = ['DateCreation', 'DateMiseAJour']

class CollaborateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collaborateur
        fields = ['IdCollaborateur', 'Nom', 'Prenom', 'Specialite',
                  'Telephone', 'Email', 'DateEmbauche', 'Actif',
                  'DateCreation', 'DateMiseAJour']
        read_only_fields = ['DateCreation', 'DateMiseAJour']

class MaintenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Maintenance
        fields = ['IdMaintenance', 'IdCollaborateur', 'DateMaintenance', 'IdVehicule',
                  'TypeMaintenance', 'Description', 'CoutMaintenance', 'KilometrageVehicule',
                  'DureeMaintenance', 'StatutMaintenance', 'DateFinMaintenance',
                  'DateCreation', 'DateMiseAJour']
        read_only_fields = ['DateCreation', 'DateMiseAJour']