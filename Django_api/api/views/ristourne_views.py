from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Ristourne
from ..serializers import RistourneSerializer
from ..tasks import update_ristourne_task

@api_view(['GET', 'POST'])
def ristourne_list(request):
    """
    Liste toutes les ristournes ou crée une nouvelle ristourne
    """
    if request.method == 'GET':
        ristournes = Ristourne.objects.all()
        serializer = RistourneSerializer(ristournes, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = RistourneSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def ristourne_detail(request, pk):
    """
    Récupère, met à jour ou supprime une ristourne
    """
    try:
        ristourne = Ristourne.objects.get(pk=pk)
    except Ristourne.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = RistourneSerializer(ristourne)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        # Envoie la tâche à Celery pour traitement asynchrone
        task = update_ristourne_task.delay(pk, request.data)
        
        # Récupère les données actuelles pour la réponse
        current_data = RistourneSerializer(ristourne).data
        
        return Response({
            "message": f"Mise à jour de la ristourne {pk} en cours",
            "task_id": task.id,
            "current_data": current_data
        })
    
    elif request.method == 'DELETE':
        ristourne.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def devis_ristournes_list(request, devis_id):
    """
    Liste toutes les ristournes d'un devis spécifique
    """
    try:
        ristournes = Ristourne.objects.filter(IdDevis=devis_id)
        serializer = RistourneSerializer(ristournes, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def commercial_ristournes_list(request, commercial_id):
    """
    Liste toutes les ristournes accordées par un commercial spécifique
    """
    try:
        ristournes = Ristourne.objects.filter(IdCommercial=commercial_id)
        serializer = RistourneSerializer(ristournes, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)