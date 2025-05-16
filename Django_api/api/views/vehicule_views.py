from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Vehicule, Transport
from ..tasks import process_vehicule_maintenance
from ..serializers import VehiculeSerializer, TransportSerializer
from ..tasks import update_vehicule_task

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
        # Vérifie si le véhicule existe avant de soumettre la tâche
        if not Vehicule.objects.filter(pk=pk).exists():
            return Response({"error": "Véhicule non trouvé"}, status=status.HTTP_404_NOT_FOUND)
        
        # Envoie la tâche à Celery pour traitement asynchrone
        task = update_vehicule_task.delay(pk, request.data)
        
        # Récupère les données actuelles pour la réponse
        current_data = VehiculeSerializer(vehicule).data
        
        return Response({
            "message": f"Mise à jour du véhicule {pk} en cours",
            "task_id": task.id,
            "current_data": current_data
        })
    
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
    Permet de mettre un véhicule en maintenance via Celery (asynchrone)
    """
    try:
        # Vérifie d'abord si le véhicule existe
        vehicule = Vehicule.objects.get(pk=id)
        
        # Prépare les données de maintenance si présentes
        maintenance_data = request.data.get('maintenance_data')
        
        # Envoie la tâche à Celery pour traitement asynchrone
        task = process_vehicule_maintenance.delay(
            vehicule_id=id, 
            maintenance_data=maintenance_data
        )
        
        return Response({
            "message": f"Mise en maintenance du véhicule {id} en cours",
            "task_id": task.id,
            "current_status": vehicule.Statut
        })
        
    except Vehicule.DoesNotExist:
        return Response({"error": "Véhicule non trouvé"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    except Vehicule.DoesNotExist:
        return Response({"error": "Véhicule non trouvé"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)