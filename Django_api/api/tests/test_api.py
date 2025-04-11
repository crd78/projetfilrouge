from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from django.utils import timezone
from api.models import (
    Personne, Product, Devis, Commande, Entrepot, 
    Vehicule, Transport, Livraison, Maintenance, Ristourne, Livreur
)
from datetime import datetime, timedelta

class ClientTests(APITestCase):
    """Tests pour les endpoints liés aux clients"""
    
    def setUp(self):
        """Configuration initiale pour les tests"""
        # Créer un utilisateur pour l'authentification si nécessaire
        self.user = User.objects.create_user(
            username='testuser', 
            email='test@example.com',
            password='testpassword123'
        )
        # Créer un client pour les tests
        self.client_data = {
            'nom': 'Dupont',
            'prenom': 'Jean',
            'telephone': '0123456789',
            'email': 'jean.dupont@example.com',
            'adresse': '1 rue de la Paix',
            'role': 1,  # Client
            'code_postal': '75000',
            'ville': 'Paris',
            'raison_sociale': 'Boulangerie Dupont',
            'siret': '12345678901234'
        }
        self.client_obj = Personne.objects.create(**self.client_data)

    def test_client_inscription(self):
        """Teste l'inscription d'un nouveau client"""
        url = reverse('client_inscription')
        data = {
            'nom': 'Martin',
            'prenom': 'Pierre',
            'telephone': '0987654321',
            'email': 'pierre.martin@example.com',
            'adresse': '2 avenue des Champs-Élysées',
            'role': 1,  # Client
            'code_postal': '75008',
            'ville': 'Paris',
            'raison_sociale': 'Boulangerie Martin',
            'siret': '98765432109876'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Personne.objects.count(), 2)
        self.assertEqual(Personne.objects.last().nom, 'Martin')

    def test_client_detail(self):
        """Teste la récupération des détails d'un client"""
        url = reverse('client_detail', kwargs={'id': self.client_obj.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nom'], 'Dupont')


class ProductTests(APITestCase):
    """Tests pour les endpoints liés aux produits"""
    
    def setUp(self):
        """Configuration initiale pour les tests"""
        # Créer quelques produits pour les tests
        self.product1 = Product.objects.create(
            NomProduit="Farine T45",
            TypeProduit="MATERIEL",
            PrixHT=20.00,
            PrixTTC=21.10,
            QuantiteStock=100
        )
        self.product2 = Product.objects.create(
            NomProduit="Levure",
            TypeProduit="MATERIEL",
            PrixHT=5.00,
            PrixTTC=5.28,
            QuantiteStock=50
        )
    
    def test_product_list(self):
        """Teste la récupération de la liste des produits"""
        url = reverse('product_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['NomProduit'], 'Farine T45')
        self.assertEqual(response.data[1]['NomProduit'], 'Levure')


class DevisTests(APITestCase):
    """Tests pour les endpoints liés aux devis"""
    
    def setUp(self):
        """Configuration initiale pour les tests"""
        # Créer un client et un commercial pour les devis
        self.client_obj = Personne.objects.create(
            nom='Dupont', prenom='Jean', role=1,  # Client
            email='jean.dupont@example.com'
        )
        self.commercial = Personne.objects.create(
            nom='Vendeur', prenom='Paul', role=2,  # Commercial
            email='paul.vendeur@example.com'
        )
        # Créer un devis pour les tests
        self.devis = Devis.objects.create(
            IdClient=self.client_obj,
            idCommercial=self.commercial,
            MontantTotalHT=100.00,
            MontantTotalTTC=120.00
        )
    
    def test_devis_list(self):
        """Teste la récupération de la liste des devis"""
        url = reverse('devis_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(float(response.data[0]['MontantTotalHT']), 100.00)
    
    def test_devis_detail(self):
        """Teste la récupération des détails d'un devis"""
        url = reverse('devis_detail', kwargs={'id': self.devis.IdDevis})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(float(response.data['MontantTotalTTC']), 120.00)
    
    def test_devis_accepter(self):
        """Teste l'acceptation d'un devis"""
        url = reverse('devis_accepter', kwargs={'id': self.devis.IdDevis})
        response = self.client.put(url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('commande', response.data)


class CommandeTests(APITestCase):
    """Tests pour les endpoints liés aux commandes"""
    
    def setUp(self):
        """Configuration initiale pour les tests"""
        # Créer un client pour les commandes
        self.client_obj = Personne.objects.create(
            nom='Dupont', prenom='Jean', role=1,  # Client
            email='jean.dupont@example.com'
        )
        # Créer une commande pour les tests
        self.commande = Commande.objects.create(
            IdClient=self.client_obj,
            Statut='EN_ATTENTE',
            MontantTotalHT=200.00,
            MontantTotalTTC=240.00
        )
    
    def test_commande_list(self):
        """Teste la récupération de la liste des commandes"""
        url = reverse('commande_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(float(response.data[0]['MontantTotalHT']), 200.00)
    
    def test_commande_detail(self):
        """Teste la récupération des détails d'une commande"""
        url = reverse('commande_detail', kwargs={'id': self.commande.IdCommande})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(float(response.data['MontantTotalTTC']), 240.00)

    def test_commande_payer(self):
        """Teste le paiement d'une commande"""
        url = reverse('commande_payer', kwargs={'id': self.commande.IdCommande})
        response = self.client.put(url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        # Vérifier que la commande est bien marquée comme payée
        self.commande.refresh_from_db()
        self.assertTrue(self.commande.EstPayee)

    def test_commande_livrer(self):
        """Teste la livraison d'une commande"""
        url = reverse('commande_livrer', kwargs={'id': self.commande.IdCommande})
        response = self.client.put(url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class VehiculeTests(APITestCase):
    """Tests pour les endpoints liés aux véhicules"""
    
    def setUp(self):
        """Configuration initiale pour les tests"""
        # Créer un véhicule pour les tests
        self.vehicule = Vehicule.objects.create(
            TypeVehicule='CAMION',
            Statut='DISPONIBLE',
            Immatriculation='AB-123-CD'
        )
    
    def test_vehicule_list(self):
        """Teste la récupération de la liste des véhicules"""
        url = reverse('vehicule_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['TypeVehicule'], 'CAMION')
    
    def test_vehicule_detail(self):
        """Teste la récupération des détails d'un véhicule"""
        url = reverse('vehicule_detail', kwargs={'pk': self.vehicule.IdVehicule})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['Immatriculation'], 'AB-123-CD')
    
    def test_vehicule_maintenance(self):
        """Teste la mise en maintenance d'un véhicule"""
        url = reverse('vehicule_maintenance', kwargs={'id': self.vehicule.IdVehicule})
        response = self.client.put(url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Vérifier que le véhicule est bien en maintenance
        self.vehicule.refresh_from_db()
        self.assertEqual(self.vehicule.Statut, 'EN_MAINTENANCE')


class TransportTests(APITestCase):
    """Tests pour les endpoints liés aux transports"""
    
    def setUp(self):
        """Configuration initiale pour les tests"""
        # Créer un véhicule pour les transports
        self.vehicule = Vehicule.objects.create(
            TypeVehicule='CAMION',
            Statut='DISPONIBLE',
            Immatriculation='AB-123-CD'
        )
        # Créer un transport pour les tests
        self.transport = Transport.objects.create(
            IdVehicule=self.vehicule,
            CoutKilometre=0.50,
            FraisFixes=20.00,
            Distance=100.00
        )
    
    def test_transport_create(self):
        """Teste la création d'un transport"""
        url = reverse('transport_create')
        data = {
            'IdVehicule': self.vehicule.IdVehicule,
            'CoutKilometre': 0.60,
            'FraisFixes': 25.00,
            'Distance': 150.00
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Transport.objects.count(), 2)
        
        # Trouver le transport créé plutôt que de prendre le dernier (plus sûr)
        new_transport = Transport.objects.filter(Distance=150.00).first()
        self.assertIsNotNone(new_transport)
        self.assertEqual(float(new_transport.Distance), 150.00)
    
    def test_transport_update_status(self):
        """Teste la mise à jour du statut d'un transport"""
        url = reverse('transport_update_status', kwargs={'id': self.transport.IdTransport})
        data = {
            'status': 'EN_COURS'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Vérifier que le transport a une date de début
        self.transport.refresh_from_db()
        self.assertIsNotNone(self.transport.DateDebut)


class MaintenanceTests(APITestCase):
    """Tests pour les endpoints liés aux maintenances"""
    
    def setUp(self):
        """Configuration initiale pour les tests"""
        # Créer un véhicule et un collaborateur pour les maintenances
        self.vehicule = Vehicule.objects.create(
            TypeVehicule='CAMION',
            Statut='DISPONIBLE',
            Immatriculation='AB-123-CD'
        )
        self.collaborateur = Personne.objects.create(
            nom='Tech', prenom='Pierre', role=3,  # Collaborateur
            email='pierre.tech@example.com'
        )
        # Créer une maintenance pour les tests
        self.maintenance = Maintenance.objects.create(
            IdVehicule=self.vehicule,
            IdCollaborateur=self.collaborateur,
            DateMaintenance=timezone.now(),
            TypeMaintenance='REVISION',
            StatutMaintenance='PLANIFIEE'
        )
    
    def test_maintenance_list(self):
        """Teste la récupération de la liste des maintenances"""
        url = reverse('maintenance_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['TypeMaintenance'], 'REVISION')
    
    def test_maintenance_detail(self):
        """Teste la récupération des détails d'une maintenance"""
        url = reverse('maintenance_detail', kwargs={'pk': self.maintenance.IdMaintenance})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['StatutMaintenance'], 'PLANIFIEE')
    
    def test_update_maintenance_status(self):
        """Teste la mise à jour du statut d'une maintenance"""
        url = reverse('update_maintenance_status', kwargs={'pk': self.maintenance.IdMaintenance, 'statut': 'TERMINEE'})
        response = self.client.put(url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Vérifier que le statut de la maintenance a été mis à jour
        self.maintenance.refresh_from_db()
        self.assertEqual(self.maintenance.StatutMaintenance, 'TERMINEE')
        self.assertIsNotNone(self.maintenance.DateFinMaintenance)


class LivraisonTests(APITestCase):
    """Tests pour les endpoints liés aux livraisons"""
    
    def setUp(self):
        """Configuration initiale pour les tests"""
        # Créer un client pour les commandes
        self.client_obj = Personne.objects.create(
            nom='Dupont', prenom='Jean', role=1,  # Client
            email='jean.dupont@example.com'
        )
        # Créer une commande
        self.commande = Commande.objects.create(
            IdClient=self.client_obj,
            Statut='EN_ATTENTE',
            MontantTotalHT=200.00,
            MontantTotalTTC=240.00
        )
        # Créer un véhicule pour les transports
        self.vehicule = Vehicule.objects.create(
            TypeVehicule='CAMION',
            Statut='DISPONIBLE',
            Immatriculation='AB-123-CD'
        )
        # Créer un transport
        self.transport = Transport.objects.create(
            IdVehicule=self.vehicule,
            CoutKilometre=0.50,
            FraisFixes=20.00,
            Distance=100.00
        )
        # Créer un produit et un entrepôt
        self.produit = Product.objects.create(
            NomProduit="Farine T45",
            TypeProduit="MATERIEL",
            PrixHT=20.00,
            PrixTTC=21.10,
            QuantiteStock=100
        )
        self.entrepot = Entrepot.objects.create(
            IdProduit=self.produit,
            Localisation="Entrepôt Central",
            CapaciteStock=1000
        )
        # Créer une livraison
        self.livraison = Livraison.objects.create(
            IdCommande=self.commande,
            IdTransport=self.transport,
            IdEntrepot=self.entrepot,
            Statut='ATTENTE'
        )
    
    def test_livraison_list(self):
        """Teste la récupération de la liste des livraisons"""
        url = reverse('livraison_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['Statut'], 'ATTENTE')
    
    def test_livraison_detail(self):
        """Teste la récupération des détails d'une livraison"""
        url = reverse('livraison_detail', kwargs={'pk': self.livraison.IdLivraison})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['Statut'], 'ATTENTE')
    
    def test_update_livraison_status(self):
        """Teste la mise à jour du statut d'une livraison"""
        url = reverse('update_livraison_status', kwargs={'pk': self.livraison.IdLivraison, 'statut': 'EN_COURS'})
        response = self.client.put(url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Vérifier que le statut de la livraison a été mis à jour
        self.livraison.refresh_from_db()
        self.assertEqual(self.livraison.Statut, 'EN_COURS')
    
    def test_commande_livraisons(self):
        """Teste la récupération des livraisons d'une commande spécifique"""
        url = reverse('commande_livraisons', kwargs={'commande_id': self.commande.IdCommande})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['Statut'], 'ATTENTE')


class RistourneTests(APITestCase):
    """Tests pour les endpoints liés aux ristournes"""
    
    def setUp(self):
        """Configuration initiale pour les tests"""
        # Créer un client et un commercial
        self.client_obj = Personne.objects.create(
            nom='Dupont', prenom='Jean', role=1,  # Client
            email='jean.dupont@example.com'
        )
        self.commercial = Personne.objects.create(
            nom='Vendeur', prenom='Paul', role=2,  # Commercial
            email='paul.vendeur@example.com'
        )
        # Créer un devis
        self.devis = Devis.objects.create(
            IdClient=self.client_obj,
            idCommercial=self.commercial,
            MontantTotalHT=100.00,
            MontantTotalTTC=120.00
        )
        # Créer une ristourne
        self.ristourne = Ristourne.objects.create(
            DateRistourne=timezone.now().date(),
            IdDevis=self.devis,
            IdCommercial=self.commercial,
            MontantRistourne=10.00
        )
    
    def test_ristourne_list(self):
        """Teste la récupération de la liste des ristournes"""
        url = reverse('ristourne_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(float(response.data[0]['MontantRistourne']), 10.00)
    
    def test_ristourne_detail(self):
        """Teste la récupération des détails d'une ristourne"""
        url = reverse('ristourne_detail', kwargs={'pk': self.ristourne.idRistourne})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(float(response.data['MontantRistourne']), 10.00)
    
    def test_devis_ristournes_list(self):
        """Teste la récupération des ristournes d'un devis spécifique"""
        url = reverse('devis_ristournes_list', kwargs={'devis_id': self.devis.IdDevis})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(float(response.data[0]['MontantRistourne']), 10.00)


class EntrepotTests(APITestCase):
    """Tests pour les endpoints liés aux entrepôts"""
    
    def setUp(self):
        """Configuration initiale pour les tests"""
        # Créer un produit pour les entrepôts
        self.produit = Product.objects.create(
            NomProduit="Farine T45",
            TypeProduit="MATERIEL",
            PrixHT=20.00,
            PrixTTC=21.10,
            QuantiteStock=100
        )
        # Créer un entrepôt pour les tests
        self.entrepot = Entrepot.objects.create(
            IdProduit=self.produit,
            Localisation="Entrepôt Central",
            CapaciteStock=1000
        )
    
    def test_entrepot_list(self):
        """Teste la récupération de la liste des entrepôts"""
        url = reverse('entrepot_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['Localisation'], 'Entrepôt Central')
    
    def test_entrepot_detail(self):
        """Teste la récupération des détails d'un entrepôt"""
        url = reverse('entrepot_detail', kwargs={'pk': self.entrepot.IdEntrepot})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['CapaciteStock'], 1000)
    
    def test_produit_entrepots(self):
        """Teste la récupération des entrepôts d'un produit spécifique"""
        url = reverse('produit_entrepots', kwargs={'produit_id': self.produit.IdProduit})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['Localisation'], 'Entrepôt Central')


class LivreurTests(APITestCase):
    """Tests pour les endpoints liés aux livreurs"""
    
    def setUp(self):
        """Configuration initiale pour les tests"""
        # Créer un livreur pour les tests
        self.livreur = Livreur.objects.create(
            Nom="Dupont",
            Prenom="Jean",
            Telephone="0123456789",
            Email="jean.dupont@example.com",
            Statut="ACTIF"
        )
        # Créer un véhicule
        self.vehicule = Vehicule.objects.create(
            TypeVehicule='CAMION',
            Statut='DISPONIBLE',
            Immatriculation='AB-123-CD'
        )
    
    def test_livreur_mission(self):
        """Teste l'assignation d'une mission à un livreur"""
        url = reverse('livreur_mission', kwargs={'id': self.livreur.IdLivreur})
        data = {
            'adresse_depart': 'Entrepôt A',
            'adresse_destination': 'Client B',
            'distance': '15 km',
            'duree': '45 minutes'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('details_trajet', response.data)
        self.assertIn('qr_code', response.data)
    
    def test_livreur_qr_code(self):
        """Teste la validation d'un QR code par un livreur"""
        # Créer un client pour les commandes
        client_obj = Personne.objects.create(
            nom='Client', prenom='Test', role=1,
            email='client.test@example.com'
        )
        # Créer une commande
        commande = Commande.objects.create(
            IdClient=client_obj,
            Statut='EN_COURS',
            MontantTotalHT=200.00,
            MontantTotalTTC=240.00
        )
        # Créer un transport
        transport = Transport.objects.create(
            IdVehicule=self.vehicule,
            CoutKilometre=0.50,
            FraisFixes=20.00,
            Distance=100.00
        )
        # Créer un produit et un entrepôt
        produit = Product.objects.create(
            NomProduit="Produit test",
            TypeProduit="MATERIEL",
            PrixHT=15.00,
            PrixTTC=18.00,
            QuantiteStock=50
        )
        entrepot = Entrepot.objects.create(
            IdProduit=produit,
            Localisation="Entrepôt Test",
            CapaciteStock=500
        )
        # Créer une livraison
        livraison = Livraison.objects.create(
            IdCommande=commande,
            IdTransport=transport,
            IdEntrepot=entrepot,
            Statut='EN_COURS',
            Commentaire=""
        )
        
        url = reverse('livreur_qr_code', kwargs={'id': self.livreur.IdLivreur})
        url += f"?token=test123&livraison_id={livraison.IdLivraison}"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        
        # Vérifier que le commentaire de la livraison a été mis à jour
        livraison.refresh_from_db()
        self.assertIn('QR code validé', livraison.Commentaire)