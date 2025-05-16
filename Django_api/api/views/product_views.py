from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Product
from ..serializers import ProductSerializer
from ..tasks import update_product_task

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

@api_view(['GET', 'PUT', 'DELETE'])
def product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        # Envoie la tâche à Celery pour traitement asynchrone
        task = update_product_task.delay(pk, request.data)
        
        # Récupère les données actuelles pour la réponse
        current_data = ProductSerializer(product).data
        
        return Response({
            "message": f"Mise à jour du produit {pk} en cours",
            "task_id": task.id,
            "current_data": current_data
        })
    
    elif request.method == 'DELETE':
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)