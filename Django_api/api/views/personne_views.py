from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view,permission_classes
from rest_framework import status
from ..models import Personne
from ..serializers import PersonneSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from ..tasks import update_client_task, update_commercial_task, update_fournisseur_task

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
        # Envoie la tâche à Celery pour traitement asynchrone
        task = update_client_task.delay(id, request.data)
        
        # Récupère les données actuelles pour la réponse
        current_data = PersonneSerializer(client).data
        
        return Response({
            "message": f"Mise à jour du client {id} en cours",
            "task_id": task.id,
            "current_data": current_data
        })
    elif request.method == 'DELETE':
        client.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([AllowAny])
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

@api_view(['POST'])
@permission_classes([AllowAny])
def client_connexion(request):
    """
    Permet à un utilisateur de se connecter avec son email et mot de passe
    et reçoit un token JWT en retour.
    """
    email = request.data.get('email')
    password = request.data.get('password')
    
    try:
        # Rechercher l'utilisateur par email
        personne = Personne.objects.get(email=email)
        
        # Vérifier le mot de passe
        if check_password(password, personne.password):
            # Créer manuellement un token JWT
            refresh = RefreshToken()
            
            # Ajouter des claims personnalisés
            refresh['user_id'] = personne.id
            refresh['email'] = personne.email
            refresh['role'] = personne.role
            refresh['nom'] = personne.nom
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': personne.id,
                    'nom': personne.nom,
                    'prenom': personne.prenom,
                    'email': personne.email,
                    'role': personne.role
                }
            })
        else:
            return Response({'error': 'Identifiants invalides'}, status=status.HTTP_401_UNAUTHORIZED)
    except Personne.DoesNotExist:
        return Response({'error': 'Identifiants invalides'}, status=status.HTTP_401_UNAUTHORIZED)
    
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
        # Envoie la tâche à Celery pour traitement asynchrone
        task = update_commercial_task.delay(id, request.data)
        
        # Récupère les données actuelles pour la réponse
        current_data = PersonneSerializer(commercial).data
        
        return Response({
            "message": f"Mise à jour du commercial {id} en cours",
            "task_id": task.id,
            "current_data": current_data
        })
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
        # Envoie la tâche à Celery pour traitement asynchrone
        task = update_fournisseur_task.delay(id, request.data)
        
        # Récupère les données actuelles pour la réponse
        current_data = PersonneSerializer(fournisseur).data
        
        return Response({
            "message": f"Mise à jour du fournisseur {id} en cours",
            "task_id": task.id,
            "current_data": current_data
        })
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
    
    # Envoie la tâche à Celery pour traitement asynchrone
    task = update_fournisseur_task.delay(id, request.data)
    
    # Récupère les données actuelles pour la réponse
    current_data = PersonneSerializer(fournisseur).data
    
    return Response({
        "message": f"Mise à jour du fournisseur {id} en cours",
        "task_id": task.id,
        "current_data": current_data
    })