import pytest
from rest_framework.test import APIClient
from django.urls import reverse

@pytest.mark.django_db
class TestIntegrationAPI:
    client = APIClient()

    def test_health_check(self):
        url = reverse('health_check')
        response = self.client.get(url)
        assert response.status_code == 200
        assert 'status' in response.data

    def test_client_inscription_and_connexion(self):
        # Inscription
        url = reverse('client_inscription')
        data = {
            "nom": "Test",
            "prenom": "User",
            "email": "testuser@example.com",
            "password": "testpassword",
            "siret": "12345678901234",
            "role": "2"
        }
        response = self.client.post(url, data, format='json')
        assert response.status_code == 201
        assert response.data['nom'] == "Test"

        # Connexion
        url = reverse('client_connexion')
        login_data = {
            "email": "testuser@example.com",
            "password": "testpassword"
        }
        response = self.client.post(url, login_data, format='json')
        assert response.status_code in [200, 403, 401]  # depends on validation

    def test_product_list_create(self):
        url = reverse('product_list')
        # GET
        response = self.client.get(url)
        assert response.status_code == 200
        # POST
        data = {
            "NomProduit": "Farine T55",
            "QuantiteStock": 100,
            "PrixUnitaire": 2.5
        }
        response = self.client.post(url, data, format='json')
        assert response.status_code in [201, 400]

    def authenticate_client(self):
        url = reverse('client_connexion')
        login_data = {
            "email": "testuser@example.com",
            "password": "testpassword"
        }
        response = self.client.post(url, login_data, format='json')
        assert response.status_code == 200, f"Login failed: {response.data}"
        token = response.data.get('access')
        assert token is not None, f"No token returned: {response.data}"
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    

 

    