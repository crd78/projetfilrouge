from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import  Devis, Commande 
from ..serializers import DevisSerializer

@api_view(['GET', 'POST'])
def devis_list(request):
    """
    Liste tous les devis ou crée un nouveau devis
    """
    if request.method == 'GET':
        devis = Devis.objects.all()
        serializer = DevisSerializer(devis, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = DevisSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def devis_detail(request, id):
    """
    Récupère, met à jour ou supprime un devis
    """
    try:
        devis = Devis.objects.get(pk=id)
    except Devis.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = DevisSerializer(devis)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = DevisSerializer(devis, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        devis.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def client_devis_list(request, client_id):
    """
    Liste tous les devis d'un client spécifique
    """
    try:
        devis = Devis.objects.filter(IdClient=client_id)
        serializer = DevisSerializer(devis, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def devis_accepter(request, id):
    """
    Permet à un boulanger d'accepter un devis validé par le commercial.
    """
    try:
        devis = Devis.objects.get(pk=id)
        
        # Mettre à jour le statut du devis pour indiquer qu'il est accepté
        # (Vous devrez peut-être ajouter un champ statut au modèle Devis)
        
        # Si vous voulez aussi créer une commande à partir du devis
        nouvelle_commande = Commande.objects.create(
            IdClient=devis.IdClient,
            MontantTotalHT=devis.MontantTotalHT,
            MontantTotalTTC=devis.MontantTotalTTC,
            # Autres champs nécessaires
        )
        
        # Réponse avec le devis modifié
        serializer = DevisSerializer(devis)
        return Response({
            "message": "Devis accepté avec succès",
            "devis": serializer.data,
            "commande": {
                "id": nouvelle_commande.IdCommande,
                # Autres informations sur la commande
            }
        })
    except Devis.DoesNotExist:
        return Response({"error": "Devis non trouvé"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)