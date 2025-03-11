from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Commande
from ..serializers import CommandeSerializer

@api_view(['GET', 'POST'])
def commande_list(request):
    """
    Liste toutes les commandes ou crée une nouvelle commande
    """
    if request.method == 'GET':
        commandes = Commande.objects.all()
        serializer = CommandeSerializer(commandes, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = CommandeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def commande_detail(request, pk):
    """
    Récupère, met à jour ou supprime une commande
    """
    try:
        commande = Commande.objects.get(pk=pk)
    except Commande.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = CommandeSerializer(commande)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = CommandeSerializer(commande, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        commande.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def client_commandes_list(request, client_id):
    """
    Liste toutes les commandes d'un client spécifique
    """
    try:
        commandes = Commande.objects.filter(IdClient=client_id)
        serializer = CommandeSerializer(commandes, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def commandes_by_status(request, statut):
    """
    Liste toutes les commandes ayant un statut spécifique
    """
    try:
        commandes = Commande.objects.filter(Statut=statut.upper())
        serializer = CommandeSerializer(commandes, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)