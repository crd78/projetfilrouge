from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Personne
from ..serializers import PersonneSerializer

@api_view(['GET'])
def personne_list(request):
    """
    Liste toutes les personnes.
    """
    personnes = Personne.objects.all()
    serializer = PersonneSerializer(personnes, many=True)
    return Response(serializer.data)

# Fonctions pour les clients (rôle = 1 par exemple)
@api_view(['GET'])
def client_list(request):
    """
    Liste tous les clients.
    """
    clients = Personne.objects.filter(role=1)  # Supposons que Role=1 pour les clients
    serializer = PersonneSerializer(clients, many=True)
    return Response(serializer.data)

@api_view(['GET', 'PUT', 'DELETE'])
def client_detail(request, id):
    """
    Récupère, met à jour ou supprime un client.
    """
    try:
        client = Personne.objects.get(pk=id, role=1)
    except Personne.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = PersonneSerializer(client)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = PersonneSerializer(client, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        client.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def client_inscription(request):
    """
    Permet à un boulanger de s'inscrire sur le site avec les informations nécessaires (nom, prénom, siret, etc.).
    """
    data = request.data
    # Assurer que le rôle est correctement défini
    data['role'] = 1  # Client
    
    serializer = PersonneSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Fonctions pour les commerciaux (rôle = 2 par exemple)
@api_view(['GET'])
def commercial_list(request):
    """
    Liste tous les commerciaux.
    """
    commerciaux = Personne.objects.filter(role=2)  # Supposons que Role=2 pour les commerciaux
    serializer = PersonneSerializer(commerciaux, many=True)
    return Response(serializer.data)

@api_view(['GET', 'PUT', 'DELETE'])
def commercial_detail(request, id):
    """
    Récupère, met à jour ou supprime un commercial.
    """
    try:
        commercial = Personne.objects.get(pk=id, Role=2)
    except Personne.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = PersonneSerializer(commercial)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = PersonneSerializer(commercial, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        commercial.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Fonctions pour les fournisseurs (rôle = 3 par exemple)
@api_view(['GET'])
def fournisseur_list(request):
    """
    Liste les minoteries avec leurs produits associés.
    """
    fournisseurs = Personne.objects.filter(role=3)  # Supposons que Role=3 pour les fournisseurs
    serializer = PersonneSerializer(fournisseurs, many=True)
    return Response(serializer.data)

@api_view(['GET', 'PUT', 'DELETE'])
def fournisseur_detail(request, id):
    """
    Détails d'une minoterie.
    """
    try:
        fournisseur = Personne.objects.get(pk=id, role=3)
    except Personne.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = PersonneSerializer(fournisseur)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = PersonneSerializer(fournisseur, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        fournisseur.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def fournisseur_create(request):
    """
    Permet à un commercial d'ajouter une nouvelle minoterie (fournisseur) dans l'application.
    """
    data = request.data
    # Assurer que le rôle est correctement défini
    data['role'] = 3  # Fournisseur
    
    serializer = PersonneSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def fournisseur_update(request, id):
    """
    Permet à un commercial de modifier les informations d'un fournisseur existant.
    """
    try:
        fournisseur = Personne.objects.get(pk=id, role=3)
    except Personne.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = PersonneSerializer(fournisseur, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)