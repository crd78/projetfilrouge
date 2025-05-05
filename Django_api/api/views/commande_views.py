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
def commande_detail(request, id):
    """
    Récupère, met à jour ou supprime une commande
    """
    try:
        commande = Commande.objects.get(pk=id)
    except Commande.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    # Le reste du code reste identique
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
    

@api_view(['PUT'])
def commande_payer(request, id):
    """
    Permet à un boulanger de marquer une commande comme payée après le virement bancaire.
    """
    try:
        commande = Commande.objects.get(pk=id)
        
        # Mettre à jour le statut de paiement de la commande
        commande.EstPayee = True
        from datetime import datetime
        commande.DatePaiement = datetime.now()
        commande.save()
        
        serializer = CommandeSerializer(commande)
        return Response({
            "message": "Commande marquée comme payée avec succès",
            "commande": serializer.data
        })
    except Commande.DoesNotExist:
        return Response({"error": "Commande non trouvée"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def commande_livrer(request, id):
    """
    Permet de marquer une commande comme livrée par le livreur.
    """
    try:
        commande = Commande.objects.get(pk=id)
        
        # Mettre à jour le statut de la commande
        commande.Statut = 'LIVREE'
        commande.save()
        
        serializer = CommandeSerializer(commande)
        return Response({
            "message": "Commande marquée comme livrée avec succès",
            "commande": serializer.data
        })
    except Commande.DoesNotExist:
        return Response({"error": "Commande non trouvée"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)