from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password  # Ajoutez cet import
from .models import (
    Product, UserProfile, Devis, 
    Commande, Ristourne, Entrepot, StockMouvement,
    Vehicule, Transport, Livraison,
    DetailsCommande, Maintenance, Personne  
)
from .models import Contact

class PersonneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Personne
        fields = [
            'id', 'nom', 'prenom', 'telephone', 'email', 'password', 
            'adresse', 'role', 'fonction', 'code_postal', 'ville',
            'raison_sociale', 'siret', 'date_creation', 'date_miseajour',
            'valider', 'statut'  # Retire 'id_vehicule'
        ]

    def create(self, validated_data):
        # Hash le mot de passe avant de l'enregistrer
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data.get('password'))
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        # Hash le mot de passe avant de le mettre à jour, si fourni
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data.get('password'))
        return super().update(instance, validated_data)



class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'IdProduit', 'NomProduit', 'TypeProduit', 'PrixHT', 'PrixTTC',
            'IdMouvement', 'DateCreation', 'DateMiseAJour'
        ]
        read_only_fields = ['DateCreation', 'DateMiseAJour', 'PrixTTC']

    def create(self, validated_data):
        prix_ht = validated_data.get('PrixHT')
        validated_data['PrixTTC'] = round(float(prix_ht) * 1.05, 2) if prix_ht is not None else None
        return super().create(validated_data)

    def update(self, instance, validated_data):
        prix_ht = validated_data.get('PrixHT', instance.PrixHT)
        validated_data['PrixTTC'] = round(float(prix_ht) * 1.05, 2) if prix_ht is not None else instance.PrixTTC
        return super().update(instance, validated_data)

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
    

class DevisSerializer(serializers.ModelSerializer):
    produits = serializers.SerializerMethodField()
    nomProduits = serializers.SerializerMethodField()
    client = PersonneSerializer(source='IdClient', read_only=True)
    remise = serializers.SerializerMethodField()  # <-- AJOUT

    class Meta:
        model = Devis
        fields = [
            'IdDevis', 'client', 'IdClient', 'idCommercial', 'MontantTotalHT', 'MontantTotalTTC',
            'DateCreation', 'DateMiseAJour', 'produits', 'nomProduits', 'Approuver', 'remise'  # <-- AJOUT
        ]
        read_only_fields = ['DateCreation', 'DateMiseAJour']

    def get_remise(self, obj):
        # Récupère la ristourne associée au devis
        ristourne = Ristourne.objects.filter(IdDevis=obj).first()
        return float(ristourne.MontantRistourne) if ristourne else 0.0

    def get_produits(self, obj):
        return [
            {
                "id": dc.IdProduit_id,
                "nom": dc.IdProduit.NomProduit,
                "PrixHT": float(dc.IdProduit.PrixHT),
                "PrixTTC": float(dc.IdProduit.PrixTTC),
                "quantite": dc.Quantite
            }
            for dc in DetailsCommande.objects.filter(IdDevis=obj)
        ]

    def get_nomProduits(self, obj):
        return [
            dc.IdProduit.NomProduit
            for dc in DetailsCommande.objects.filter(IdDevis=obj)
        ]

class RistourneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ristourne
        fields = ['idRistourne', 'DateRistourne', 'IdDevis', 'IdCommercial', 'MontantRistourne', 'Commentaire']

class CommandeSerializer(serializers.ModelSerializer):
    client = PersonneSerializer(source='IdClient', read_only=True)
    produits = serializers.SerializerMethodField()
    livraisons = serializers.SerializerMethodField()  # <-- AJOUT

    class Meta:
        model = Commande
        fields = [
            'IdCommande', 'client', 'IdClient', 'DateCommande', 'Statut',
            'MontantTotalHT', 'MontantTotalTTC', 'DateMiseAJour', 'produits',
            'livraisons'  # <-- AJOUT
        ]
        read_only_fields = ['DateCommande', 'DateMiseAJour']

    def get_produits(self, obj):
        details = DetailsCommande.objects.filter(IdCommande=obj.IdCommande)
        return DetailsCommandeSerializer(details, many=True).data

    def get_livraisons(self, obj):
        from .serializers import LivraisonSerializer
        livraisons = Livraison.objects.filter(IdCommande=obj.IdCommande)
        return LivraisonSerializer(livraisons, many=True).data

class EntrepotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrepot
        fields = ['IdEntrepot', 'IdProduit', 'Localisation', 'CapaciteStock', 
                 'IdMouvement', 'DateCreation', 'DateMiseAJour']
        read_only_fields = ['DateCreation', 'DateMiseAJour']

class VehiculeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicule
        fields = [
            'IdVehicule',
            'TypeVehicule',
            'Statut',
            'Immatriculation',
            'DateCreation',
            'DateMiseAJour'
        ]
        read_only_fields = ['DateCreation', 'DateMiseAJour']

class TransportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transport
        fields = ['IdTransport', 'CoutKilometre', 'FraisFixes', 'IdVehicule',
                 'DateDebut', 'DateFin', 'Distance', 'CoutTotal', 'CommissionChauffeur',
                 'Commentaire', 'DateCreation', 'DateMiseAJour']
        read_only_fields = ['DateCreation', 'DateMiseAJour', 'CoutTotal']


class DetailsCommandeSerializer(serializers.ModelSerializer):
    produit = ProductSerializer(source='IdProduit', read_only=True)

    class Meta:
        model = DetailsCommande
        fields = ['IdProduit', 'produit', 'Quantite']

class LivraisonSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = Livraison
        fields = [
            'IdLivraison', 'IdCommande', 'IdTransport', 'Statut',
            'IdEntrepot', 'IdVehicule', 'DatePrevue', 'DateLivraison',
            'Commentaire', 'DateCreation', 'DateMiseAJour'
        ]
        read_only_fields = ['DateCreation', 'DateMiseAJour']

class LivraisonDetailSerializer(serializers.ModelSerializer):
    commande = CommandeSerializer(source='IdCommande', read_only=True)
    class Meta:
        model = Livraison
        fields = [
            'IdLivraison', 'commande', 'IdTransport', 'Statut',
            'IdEntrepot', 'IdVehicule', 'DatePrevue', 'DateLivraison',
            'Commentaire', 'DateCreation', 'DateMiseAJour'
        ]

    def update(self, instance, validated_data):
        print("DEBUG update validated_data:", validated_data)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance



class MaintenanceSerializer(serializers.ModelSerializer):
    # Pour la lecture (GET), on inclut les objets complets
    IdVehicule = VehiculeSerializer(read_only=True)
    IdCollaborateur = PersonneSerializer(read_only=True)
    
    class Meta:
        model = Maintenance
        fields = ['IdMaintenance', 'IdCollaborateur', 'DateMaintenance', 'IdVehicule',
                  'TypeMaintenance', 'Description', 'CoutMaintenance', 'KilometrageVehicule',
                  'DureeMaintenance', 'StatutMaintenance', 'DateFinMaintenance',
                  'DateCreation', 'DateMiseAJour']
        read_only_fields = ['DateCreation', 'DateMiseAJour']

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'
        read_only_fields = ('date_creation',)
    
class StockMouvementSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockMouvement
        fields = '__all__'
        read_only_fields = ['IdMouvement']  