from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Personne
from ..serializers import PersonneSerializer

@api_view(['GET', 'POST'])
def collaborateur_list(request):
    """
    Lists all collaborators (Personne with role == 4) or creates a new one.
    """
    if request.method == 'GET':
        collaborateurs = Personne.objects.filter(role=4)
        serializer = PersonneSerializer(collaborateurs, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = PersonneSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(role=4)  # Force role = 4 for collaborateur
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def collaborateur_detail(request, pk):
    """
    Retrieves, updates or deletes a collaborator (Personne with role == 4).
    """
    try:
        collaborateur = Personne.objects.get(pk=pk, role=4)
    except Personne.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = PersonneSerializer(collaborateur)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = PersonneSerializer(collaborateur, data=request.data)
        if serializer.is_valid():
            serializer.save(role=4)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        collaborateur.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def collaborateurs_by_role(request, role):
    """
    Lists all collaborators with a given role.
    """
    try:
        collaborateurs = Personne.objects.filter(role=role)
        serializer = PersonneSerializer(collaborateurs, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)