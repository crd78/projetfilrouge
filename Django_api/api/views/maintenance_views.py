from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Maintenance, Vehicule, Personne  # Replace Collaborateur with Personne
from ..serializers import MaintenanceSerializer
from ..tasks import update_maintenance_task, update_maintenance_status_task  

@api_view(['GET', 'POST'])
def maintenance_list(request):
    """
    Liste toutes les maintenances ou crée une nouvelle maintenance.
    """
    if request.method == 'GET':
        maintenances = Maintenance.objects.all()
        serializer = MaintenanceSerializer(maintenances, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = MaintenanceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def maintenance_detail(request, pk):
    """
    Récupère, met à jour ou supprime une maintenance.
    """
    try:
        maintenance = Maintenance.objects.get(pk=pk)
    except Maintenance.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = MaintenanceSerializer(maintenance)
        return Response(serializer.data)
    elif request.method == 'PUT':
        # Envoie la tâche à Celery pour traitement asynchrone
        task = update_maintenance_task.delay(pk, request.data)
        
        # Récupère les données actuelles pour la réponse
        current_data = MaintenanceSerializer(maintenance).data
        
        return Response({
            "message": f"Mise à jour de la maintenance {pk} en cours",
            "task_id": task.id,
            "current_data": current_data
        })
    elif request.method == 'DELETE':
        maintenance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def vehicule_maintenances(request, vehicule_id):
    """
    Liste toutes les maintenances d'un véhicule spécifique.
    """
    try:
        maintenances = Maintenance.objects.filter(IdVehicule=vehicule_id)
        serializer = MaintenanceSerializer(maintenances, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def collaborateur_maintenances(request, collaborateur_id):
    """
    Liste toutes les maintenances effectuées par un collaborateur spécifique.
    Ici, un collaborateur est une Personne avec role == 4.
    """
    try:
        maintenances = Maintenance.objects.filter(IdCollaborateur=collaborateur_id)
        serializer = MaintenanceSerializer(maintenances, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_maintenance_status(request, pk, statut):
    """
    Met à jour le statut d'une maintenance via Celery (asynchrone).
    """
    try:
        # Vérifie d'abord si la maintenance existe
        maintenance = Maintenance.objects.get(pk=pk)
        
        # Envoie la tâche à Celery pour traitement asynchrone
        task = update_maintenance_status_task.delay(pk, statut)
        
        # Récupère les données actuelles pour la réponse
        current_data = MaintenanceSerializer(maintenance).data
        
        return Response({
            "message": f"Mise à jour du statut de la maintenance {pk} en cours",
            "task_id": task.id,
            "current_status": maintenance.StatutMaintenance,
            "new_status": statut.upper(),
            "current_data": current_data
        })
    except Maintenance.DoesNotExist:
        return Response({"error": "Maintenance non trouvée"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def maintenances_by_status(request, statut):
    """
    Liste toutes les maintenances ayant un statut spécifique.
    """
    try:
        maintenances = Maintenance.objects.filter(StatutMaintenance=statut.upper())
        serializer = MaintenanceSerializer(maintenances, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)