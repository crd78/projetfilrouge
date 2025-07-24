from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Maintenance, Vehicule, Personne  # Replace Collaborateur with Personne
from ..serializers import MaintenanceSerializer
from ..tasks import update_maintenance_task, update_maintenance_status_task  
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from django.utils import timezone
from datetime import datetime
import json

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
        maintenances = Maintenance.objects.select_related('IdVehicule', 'IdCollaborateur').filter(IdVehicule=vehicule_id)
        serializer = MaintenanceSerializer(maintenances, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def collaborateur_maintenances(request, collaborateur_id):
    """
    Liste toutes les maintenances effectuées par un collaborateur spécifique.
    """
    print(f"Recherche maintenances pour collaborateur {collaborateur_id}")
    try:
        if not Personne.objects.filter(id=collaborateur_id).exists():
            print("Collaborateur inexistant")
            return Response({"error": "Collaborateur inexistant"}, status=status.HTTP_404_NOT_FOUND)

        maintenances = Maintenance.objects.select_related('IdVehicule', 'IdCollaborateur').filter(IdCollaborateur=collaborateur_id)
        print(f"Trouvé {maintenances.count()} maintenances")

        serializer = MaintenanceSerializer(maintenances, many=True)
        print("Réponse envoyée à React :", serializer.data)  # <-- Ajoute ce log

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Erreur: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_maintenance_status(request, pk, statut):
    try:
        print("request.data:", request.data)
        maintenance = Maintenance.objects.get(pk=pk)
        maintenance.StatutMaintenance = statut.upper()
        
        # Parse correctement la date ISO
        date_fin_str = request.data.get('DateFinMaintenance')
        if date_fin_str:
            maintenance.DateFinMaintenance = parse_datetime(date_fin_str)
        else:
            maintenance.DateFinMaintenance = timezone.now()
            
        maintenance.save()
        serializer = MaintenanceSerializer(maintenance)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Maintenance.DoesNotExist:
        return Response({"error": "Maintenance non trouvée"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print("Erreur update_maintenance_status:", str(e))
        import traceback
        traceback.print_exc()
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

@api_view(['POST'])
def creer_maintenance(request):
    """
    Crée une nouvelle maintenance
    """
    try:
        data = request.data
        print("=== DEBUG creer_maintenance ===")
        print("Données reçues:", data)
        print("User:", request.user)
        print("User ID:", request.user.id)
        
        # Vérifications basiques
        if not data.get('IdVehicule'):
            print("ERREUR: IdVehicule manquant")
            return Response({"error": "IdVehicule est requis"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Vérifier que le véhicule existe
        try:
            vehicule = Vehicule.objects.get(pk=data['IdVehicule'])
            print("Véhicule trouvé:", vehicule)
        except Vehicule.DoesNotExist:
            print("ERREUR: Véhicule non trouvé")
            return Response({"error": "Véhicule non trouvé"}, status=status.HTTP_404_NOT_FOUND)
        
        # Convertir la date string en objet datetime
        date_maintenance = None
        if data.get('DateMaintenance'):
            try:
                # Convertir la date ISO string en objet datetime
                date_maintenance = datetime.fromisoformat(data['DateMaintenance'].replace('Z', '+00:00'))
                print("Date convertie:", date_maintenance)
            except Exception as e:
                print("Erreur conversion date:", e)
                return Response({"error": "Format de date invalide"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Créer la maintenance directement avec le modèle
        maintenance = Maintenance.objects.create(
            IdVehicule=vehicule,  # Passe l'objet véhicule
            IdCollaborateur_id=request.user.id,  # Passe l'ID du collaborateur
            TypeMaintenance=data.get('TypeMaintenance', 'REVISION'),
            DateMaintenance=date_maintenance,  # Utilise la date convertie
            StatutMaintenance='PLANIFIEE',
            Description=data.get('Description', '')
        )
        
        print("Maintenance créée avec succès:", maintenance)
        
        # Sérialiser pour la réponse
        serializer = MaintenanceSerializer(maintenance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
            
    except Exception as e:
        print("ERREUR EXCEPTION:", str(e))
        import traceback
        traceback.print_exc()
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)