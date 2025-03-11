from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Livreur, Vehicule, Transport
from ..serializers import LivreurSerializer, TransportSerializer

@api_view(['GET', 'POST'])
def livreur_list(request):
    """
    Liste tous les livreurs ou crée un nouveau livreur
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
    Récupère, met à jour ou supprime un livreur
    """
    try:
        livreur = Livreur.objects.get(pk=pk)
    except Livreur.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = LivreurSerializer(livreur)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = LivreurSerializer(livreur, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # Libérer le véhicule si le livreur en avait un
        if livreur.IdVehicule:
            vehicule = livreur.IdVehicule
            vehicule.Statut = 'DISPONIBLE'
            vehicule.save()
        
        livreur.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def livreurs_by_status(request, status_value):
    """
    Liste tous les livreurs ayant un statut spécifique
    """
    try:
        livreurs = Livreur.objects.filter(Statut=status_value.upper())
        serializer = LivreurSerializer(livreurs, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def livreur_transports(request, livreur_id):
    """
    Liste tous les transports effectués par un livreur via son véhicule
    """
    try:
        livreur = Livreur.objects.get(pk=livreur_id)
        if not livreur.IdVehicule:
            return Response({"message": "Ce livreur n'a pas de véhicule attribué"}, 
                          status=status.HTTP_404_NOT_FOUND)
        
        transports = Transport.objects.filter(IdVehicule=livreur.IdVehicule)
        serializer = TransportSerializer(transports, many=True)
        return Response(serializer.data)
    except Livreur.DoesNotExist:
        return Response({"error": "Livreur non trouvé"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def assign_vehicle_to_livreur(request, livreur_id, vehicule_id):
    """
    Assigne un véhicule à un livreur
    """
    try:
        livreur = Livreur.objects.get(pk=livreur_id)
        vehicule = Vehicule.objects.get(pk=vehicule_id)
        
        # Vérifier si le véhicule est disponible
        if vehicule.Statut != 'DISPONIBLE':
            return Response(
                {"error": f"Le véhicule n'est pas disponible, statut actuel: {vehicule.Statut}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Libérer l'ancien véhicule si existant
        if livreur.IdVehicule:
            ancien_vehicule = livreur.IdVehicule
            ancien_vehicule.Statut = 'DISPONIBLE'
            ancien_vehicule.save()
        
        # Assigner le nouveau véhicule
        livreur.IdVehicule = vehicule
        livreur.save()
        
        # Mettre à jour le statut du véhicule
        vehicule.Statut = 'EN_UTILISATION'
        vehicule.save()
        
        return Response({
            "message": f"Véhicule {vehicule.IdVehicule} assigné au livreur {livreur.Prenom} {livreur.Nom}",
            "livreur": LivreurSerializer(livreur).data
        })
    except Livreur.DoesNotExist:
        return Response({"error": "Livreur non trouvé"}, status=status.HTTP_404_NOT_FOUND)
    except Vehicule.DoesNotExist:
        return Response({"error": "Véhicule non trouvé"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)