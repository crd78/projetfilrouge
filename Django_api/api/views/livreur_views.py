from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Livreur, Vehicule, Transport
from ..serializers import LivreurSerializer, TransportSerializer
from datetime import datetime
from ..tasks import update_livreur_task, terminer_livraison_task 


@api_view(['GET', 'POST'])
def livreur_list(request):
    """
    Liste tous les livreurs ou crée un nouveau livreur.
    """
    if request.method == 'GET':
        livreurs = Livreur.objects.all()
        serializer = LivreurSerializer(livreurs, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = LivreurSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def livreur_detail(request, pk):
    """
    Récupère, met à jour ou supprime un livreur.
    """
    try:
        livreur = Livreur.objects.get(pk=pk)
    except Livreur.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = LivreurSerializer(livreur)
        return Response(serializer.data)
    elif request.method == 'PUT':
        # Envoie la tâche à Celery pour traitement asynchrone
        task = update_livreur_task.delay(pk, request.data)
        
        # Récupère les données actuelles pour la réponse
        current_data = LivreurSerializer(livreur).data
        
        return Response({
            "message": f"Mise à jour du livreur {pk} en cours",
            "task_id": task.id,
            "current_data": current_data
        })
    elif request.method == 'DELETE':
        livreur.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def livreurs_by_status(request, status_value):
    """
    Lists all livreurs with a given status.
    """
    try:
        # Assuming 'Statut' field in Livreur holds the status (e.g., 'ACTIF')
        livreurs = Livreur.objects.filter(Statut=status_value.upper())
        serializer = LivreurSerializer(livreurs, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def livreur_transports(request, livreur_id):
    """
    Returns all transports associated with the vehicle assigned to a specific livreur.
    """
    try:
        livreur = Livreur.objects.get(pk=livreur_id)
        if not hasattr(livreur, 'IdVehicule') or not livreur.IdVehicule:
            return Response({"error": "No vehicle assigned to this livreur."}, status=status.HTTP_404_NOT_FOUND)
        transports = Transport.objects.filter(IdVehicule=livreur.IdVehicule)
        serializer = TransportSerializer(transports, many=True)
        return Response(serializer.data)
    except Livreur.DoesNotExist:
        return Response({"error": "Livreur not found."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def assign_vehicle_to_livreur(request, livreur_id, vehicule_id):
    """
    Assigns a vehicle to the specified livreur.
    """
    try:
        livreur = Livreur.objects.get(pk=livreur_id)
    except Livreur.DoesNotExist:
        return Response({"error": "Livreur not found."}, status=status.HTTP_404_NOT_FOUND)
    
    from ..models import Vehicule
    try:
        vehicule = Vehicule.objects.get(pk=vehicule_id)
    except Vehicule.DoesNotExist:
        return Response({"error": "Vehicule not found."}, status=status.HTTP_404_NOT_FOUND)
    
    livreur.IdVehicule = vehicule
    livreur.save()
    return Response({"message": f"Vehicle {vehicule.IdVehicule} assigned to livreur {livreur.Prenom} {livreur.Nom}."})

@api_view(['POST'])
def livreur_mission(request, id):
    """
    Permet à un livreur de recevoir une mission de livraison avec QR code et détails du trajet.
    """
    try:
        livreur = Livreur.objects.get(pk=id)
        
        # Traitement de la mission (à adapter selon votre logique métier)
        mission_data = request.data
        
        # Si la mission inclut un transport, vous pourriez vouloir l'associer au livreur
        if 'transport_id' in mission_data:
            try:
                transport = Transport.objects.get(pk=mission_data['transport_id'])
                # Association logique
            except Transport.DoesNotExist:
                return Response({"error": "Transport non trouvé"}, status=status.HTTP_404_NOT_FOUND)
        
        # Générer des données de simulation pour la mission
        mission_response = {
            "message": f"Mission assignée au livreur {livreur.Prenom} {livreur.Nom}",
            "livreur_id": livreur.IdLivreur,
            "details_trajet": {
                "adresse_depart": mission_data.get('adresse_depart', 'Entrepôt principal'),
                "adresse_destination": mission_data.get('adresse_destination', 'Client'),
                "distance_estimee": mission_data.get('distance', '10 km'),
                "duree_estimee": mission_data.get('duree', '30 minutes')
            },
            "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="  # QR code factice
        }
        
        return Response(mission_response)
        
    except Livreur.DoesNotExist:
        return Response({"error": "Livreur non trouvé"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def livreur_livraison_termine(request, id):
    """
    Permet à un livreur de marquer une livraison comme terminée après livraison au client.
    """
    try:
        # Vérifie d'abord si le livreur existe
        livreur = Livreur.objects.get(pk=id)
        
        # Envoie la tâche à Celery pour traitement asynchrone
        task = terminer_livraison_task.delay(id, request.data)
        
        return Response({
            "message": f"Traitement de fin de livraison en cours",
            "task_id": task.id,
            "livreur": f"{livreur.Prenom} {livreur.Nom}"
        })
    except Livreur.DoesNotExist:
        return Response({"error": "Livreur non trouvé"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def livreur_qr_code(request, id):
    """
    Permet à un livreur de scanner un QR code lors de la livraison pour valider la livraison.
    """
    try:
        livreur = Livreur.objects.get(pk=id)
        
        # Simulation d'un scan de QR code
        qr_token = request.query_params.get('token', None)
        livraison_id = request.query_params.get('livraison_id', None)
        
        if not qr_token or not livraison_id:
            return Response({"error": "Token QR et ID de livraison requis"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validation du QR code (à adapter selon votre logique)
        # Dans un cas réel, vous vérifieriez si le token correspond à celui stocké pour cette livraison
        
        try:
            from ..models import Livraison
            livraison = Livraison.objects.get(pk=livraison_id)
            
            # Mise à jour de la livraison pour indiquer qu'elle a été validée par QR code
            livraison.Commentaire = f"{livraison.Commentaire}\nQR code validé le {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
            livraison.save()
            
            return Response({
                "message": "QR code validé avec succès",
                "livreur": f"{livreur.Prenom} {livreur.Nom}",
                "livraison_id": livraison.IdLivraison,
                "validation_time": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            })
            
        except Livraison.DoesNotExist:
            return Response({"error": "Livraison non trouvée"}, status=status.HTTP_404_NOT_FOUND)
            
    except Livreur.DoesNotExist:
        return Response({"error": "Livreur non trouvé"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)