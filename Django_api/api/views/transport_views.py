from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Transport
from ..serializers import TransportSerializer

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
    Permet de changer l'état d'une demande de transport à "Livré" ou "En cours".
    """
    try:
        transport = Transport.objects.get(pk=id)
    except Transport.DoesNotExist:
        return Response({"error": "Transport non trouvé"}, status=status.HTTP_404_NOT_FOUND)
    
    # Mettons à jour les champs requis pour le statut
    if 'status' in request.data:
        status_value = request.data['status'].upper()
        
        # Mettre à jour les dates de début ou fin en fonction du statut
        from datetime import datetime
        if status_value == "EN_COURS" and not transport.DateDebut:
            transport.DateDebut = datetime.now()
        elif (status_value == "LIVRÉ" or status_value == "LIVRE") and not transport.DateFin:
            transport.DateFin = datetime.now()
        
    # Mettre à jour le transport avec les données de la requête
    serializer = TransportSerializer(transport, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)