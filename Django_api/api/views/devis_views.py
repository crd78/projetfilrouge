from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Devis, Commande 
from ..serializers import DevisSerializer
from ..tasks import update_devis_task, accepter_devis_task  # Ajoute cet import

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
        # Envoie la tâche à Celery pour traitement asynchrone
        task = update_devis_task.delay(id, request.data)
        
        # Récupère les données actuelles pour la réponse
        current_data = DevisSerializer(devis).data
        
        return Response({
            "message": f"Mise à jour du devis {id} en cours",
            "task_id": task.id,
            "current_data": current_data
        })
    
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
        # Vérifie d'abord si le devis existe
        devis = Devis.objects.get(pk=id)
        
        # Envoie la tâche à Celery pour traitement asynchrone
        task = accepter_devis_task.delay(id)
        
        # Récupère les données actuelles pour la réponse
        current_data = DevisSerializer(devis).data
        
        return Response({
            "message": f"Traitement de l'acceptation du devis {id} en cours",
            "task_id": task.id,
            "current_data": current_data
        })
    except Devis.DoesNotExist:
        return Response({"error": "Devis non trouvé"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)