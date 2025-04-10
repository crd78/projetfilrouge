from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Livreur, Vehicule, Transport
from ..serializers import LivreurSerializer, TransportSerializer

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
        serializer = LivreurSerializer(livreur, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
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