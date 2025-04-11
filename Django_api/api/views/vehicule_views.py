from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Vehicule, Transport
from ..serializers import VehiculeSerializer, TransportSerializer

@api_view(['GET', 'POST'])
def vehicule_list(request):
    """
    Liste tous les véhicules ou crée un nouveau véhicule
    """
    if request.method == 'GET':
        vehicules = Vehicule.objects.all()
        serializer = VehiculeSerializer(vehicules, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = VehiculeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def vehicule_detail(request, pk):
    """
    Récupère, met à jour ou supprime un véhicule
    """
    try:
        vehicule = Vehicule.objects.get(pk=pk)
    except Vehicule.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = VehiculeSerializer(vehicule)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = VehiculeSerializer(vehicule, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        vehicule.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def vehicule_transports(request, vehicule_id):
    """
    Liste tous les transports effectués par un véhicule spécifique
    """
    try:
        transports = Transport.objects.filter(IdVehicule=vehicule_id)
        serializer = TransportSerializer(transports, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def vehicules_by_status(request, status_value):
    """
    Liste tous les véhicules ayant un statut spécifique
    """
    try:
        vehicules = Vehicule.objects.filter(Statut=status_value.upper())
        serializer = VehiculeSerializer(vehicules, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def vehicule_maintenance(request, id):
    """
    Permet de mettre un véhicule en maintenance.
    """
    try:
        vehicule = Vehicule.objects.get(pk=id)
        
        # Vérifier si le véhicule n'est pas déjà en maintenance
        if vehicule.Statut == 'EN_MAINTENANCE':
            return Response({
                "error": "Ce véhicule est déjà en maintenance"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Mettre à jour le statut du véhicule
        vehicule.Statut = 'EN_MAINTENANCE'
        vehicule.save()
        
        # Créer une entrée de maintenance si des informations sont fournies
        if 'maintenance_data' in request.data:
            from ..models import Maintenance
            from datetime import datetime
            
            maintenance_data = request.data['maintenance_data']
            maintenance = Maintenance(
                IdVehicule=vehicule,
                DateMaintenance=datetime.now(),
                TypeMaintenance=maintenance_data.get('type', 'REVISION'),
                Description=maintenance_data.get('description', ''),
                StatutMaintenance='PLANIFIEE',
                IdCollaborateur_id=maintenance_data.get('collaborateur_id')
            )
            maintenance.save()
            
            from ..serializers import MaintenanceSerializer
            maintenance_serializer = MaintenanceSerializer(maintenance)
            
            return Response({
                "message": "Véhicule mis en maintenance avec succès",
                "vehicule": VehiculeSerializer(vehicule).data,
                "maintenance": maintenance_serializer.data
            })
        
        return Response({
            "message": "Véhicule mis en maintenance avec succès",
            "vehicule": VehiculeSerializer(vehicule).data
        })
        
    except Vehicule.DoesNotExist:
        return Response({"error": "Véhicule non trouvé"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)