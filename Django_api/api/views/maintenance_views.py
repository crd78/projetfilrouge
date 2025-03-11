from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Maintenance, Collaborateur, Vehicule
from ..serializers import MaintenanceSerializer

@api_view(['GET', 'POST'])
def maintenance_list(request):
    """
    Liste toutes les maintenances ou crée une nouvelle maintenance
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
    Récupère, met à jour ou supprime une maintenance
    """
    try:
        maintenance = Maintenance.objects.get(pk=pk)
    except Maintenance.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = MaintenanceSerializer(maintenance)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = MaintenanceSerializer(maintenance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        maintenance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def vehicule_maintenances(request, vehicule_id):
    """
    Liste toutes les maintenances d'un véhicule spécifique
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
    Liste toutes les maintenances effectuées par un collaborateur spécifique
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
    Met à jour le statut d'une maintenance
    """
    try:
        maintenance = Maintenance.objects.get(pk=pk)
        maintenance.StatutMaintenance = statut.upper()
        
        # Si la maintenance est terminée, on met à jour la date de fin
        if statut.upper() == 'TERMINEE' and not maintenance.DateFinMaintenance:
            from datetime import datetime
            maintenance.DateFinMaintenance = datetime.now()
        
        maintenance.save()
        serializer = MaintenanceSerializer(maintenance)
        return Response(serializer.data)
    except Maintenance.DoesNotExist:
        return Response({"error": "Maintenance non trouvée"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def maintenances_by_status(request, statut):
    """
    Liste toutes les maintenances ayant un statut spécifique
    """
    try:
        maintenances = Maintenance.objects.filter(StatutMaintenance=statut.upper())
        serializer = MaintenanceSerializer(maintenances, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)