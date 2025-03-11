from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Livraison, Commande, Transport
from ..serializers import LivraisonSerializer, CommandeSerializer

@api_view(['GET', 'POST'])
def livraison_list(request):
    """
    Liste toutes les livraisons ou crée une nouvelle livraison
    """
    if request.method == 'GET':
        livraisons = Livraison.objects.all()
        serializer = LivraisonSerializer(livraisons, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = LivraisonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def livraison_detail(request, pk):
    """
    Récupère, met à jour ou supprime une livraison
    """
    try:
        livraison = Livraison.objects.get(pk=pk)
    except Livraison.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = LivraisonSerializer(livraison)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = LivraisonSerializer(livraison, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        livraison.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def commande_livraisons(request, commande_id):
    """
    Liste toutes les livraisons d'une commande spécifique
    """
    try:
        livraisons = Livraison.objects.filter(IdCommande=commande_id)
        serializer = LivraisonSerializer(livraisons, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def livraisons_by_statut(request, statut):
    """
    Liste toutes les livraisons ayant un statut spécifique
    """
    try:
        livraisons = Livraison.objects.filter(Statut=statut.upper())
        serializer = LivraisonSerializer(livraisons, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_livraison_status(request, pk, statut):
    """
    Met à jour le statut d'une livraison
    """
    try:
        livraison = Livraison.objects.get(pk=pk)
        livraison.Statut = statut.upper()
        livraison.save()
        serializer = LivraisonSerializer(livraison)
        return Response(serializer.data)
    except Livraison.DoesNotExist:
        return Response({"error": "Livraison non trouvée"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)