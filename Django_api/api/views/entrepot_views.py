from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Entrepot, Product
from ..serializers import EntrepotSerializer

@api_view(['GET', 'POST'])
def entrepot_list(request):
    """
    Liste tous les entrepôts ou crée un nouvel entrepôt
    """
    if request.method == 'GET':
        entrepots = Entrepot.objects.all()
        serializer = EntrepotSerializer(entrepots, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = EntrepotSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def entrepot_detail(request, pk):
    """
    Récupère, met à jour ou supprime un entrepôt
    """
    try:
        entrepot = Entrepot.objects.get(pk=pk)
    except Entrepot.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = EntrepotSerializer(entrepot)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = EntrepotSerializer(entrepot, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        entrepot.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def produit_entrepots(request, produit_id):
    """
    Liste tous les entrepôts d'un produit spécifique
    """
    try:
        entrepots = Entrepot.objects.filter(IdProduit=produit_id)
        serializer = EntrepotSerializer(entrepots, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)