from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Commercial, Devis
from ..serializers import CommercialSerializer, DevisSerializer

@api_view(['GET', 'POST'])
def commercial_list(request):
    """
    Liste tous les commerciaux ou crée un nouveau commercial
    """
    if request.method == 'GET':
        commerciaux = Commercial.objects.all()
        serializer = CommercialSerializer(commerciaux, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = CommercialSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def commercial_detail(request, pk):
    """
    Récupère, met à jour ou supprime un commercial
    """
    try:
        commercial = Commercial.objects.get(pk=pk)
    except Commercial.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = CommercialSerializer(commercial)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = CommercialSerializer(commercial, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        commercial.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def commercial_devis_list(request, commercial_id):
    """
    Liste tous les devis d'un commercial spécifique
    """
    try:
        devis = Devis.objects.filter(idCommercial=commercial_id)
        serializer = DevisSerializer(devis, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
