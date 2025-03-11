from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Product
from ..serializers import ProductSerializer

@api_view(['GET'])
def hello_world(request):
    """
    Simple vue qui retourne un message de bienvenue
    """
    return Response({"message": "Hello, world!"})

@api_view(['GET', 'POST'])
def item_list(request):
    """
    Exemple de vue (à remplacer par un vrai modèle Item si nécessaire)
    """
    return Response({"message": "La fonctionnalité d'items sera implémentée prochainement"})

@api_view(['GET', 'POST'])
def product_list(request):
    if request.method == 'GET':
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)