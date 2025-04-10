from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
# from ..models import Client           <-- remove this line
from ..models import Personne           # use Personne instead
from ..serializers import PersonneSerializer  # update to use Personne's serializer

@api_view(['GET', 'POST'])
def client_list(request):
    """
    Liste toutes les personnes dont le rôle est Client (role = 1)
    """
    if request.method == 'GET':
        # Filter Personne based on role (assuming Client has role value 1)
        clients = Personne.objects.filter(role=1)
        serializer = PersonneSerializer(clients, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = PersonneSerializer(data=request.data)
        if serializer.is_valid():
            # You might want to enforce role 1 for created clients
            serializer.save(role=1)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def client_detail(request, pk):
    """
    Récupère, met à jour ou supprime une personne dont le rôle est Client
    """
    try:
        client = Personne.objects.get(pk=pk, role=1)
    except Personne.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = PersonneSerializer(client)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = PersonneSerializer(client, data=request.data)
        if serializer.is_valid():
            serializer.save(role=1)  # enforce client role
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        client.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)