from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Devis
from ..serializers import DevisSerializer

@api_view(['GET', 'POST'])
def devis_list(request):
    """
    Liste tous les devis ou crée un nouveau devis
    """
    if request.method == 'GET':
        devis = Devis.objects.all()
        serializer = DevisSerializer(devis, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = DevisSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def devis_detail(request, pk):
    """
    Récupère, met à jour ou supprime un devis
    """
    try:
        devis = Devis.objects.get(pk=pk)
    except Devis.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = DevisSerializer(devis)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = DevisSerializer(devis, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        devis.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def client_devis_list(request, client_id):
    """
    Liste tous les devis d'un client spécifique
    """
    try:
        devis = Devis.objects.filter(IdClient=client_id)
        serializer = DevisSerializer(devis, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)