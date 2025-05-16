from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Transport
from ..serializers import TransportSerializer
from ..tasks import update_transport_status_task

@api_view(['POST'])
def transport_create(request):
    """
    Permet d'enregistrer une demande de transport entre un fournisseur et un entrepôt
    ou entre un entrepôt et un client.
    """
    serializer = TransportSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def transport_update_status(request, id):
    """
    Permet de changer l'état d'une demande de transport via Celery (asynchrone)
    """
    try:
        # Vérifie d'abord si le transport existe
        transport = Transport.objects.get(pk=id)
        
        # Envoie la tâche à Celery pour traitement asynchrone
        task = update_transport_status_task.delay(id, request.data)
        
        # Récupère les données actuelles pour la réponse
        current_data = TransportSerializer(transport).data
        
        return Response({
            "message": f"Mise à jour du statut du transport {id} en cours",
            "task_id": task.id,
            "current_data": current_data
        })
    except Transport.DoesNotExist:
        return Response({"error": "Transport non trouvé"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)