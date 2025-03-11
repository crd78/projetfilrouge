from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Collaborateur
from ..serializers import CollaborateurSerializer

@api_view(['GET', 'POST'])
def collaborateur_list(request):
    """
    Liste tous les collaborateurs ou crée un nouveau collaborateur
    """
    if request.method == 'GET':
        collaborateurs = Collaborateur.objects.all()
        serializer = CollaborateurSerializer(collaborateurs, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = CollaborateurSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def collaborateur_detail(request, pk):
    """
    Récupère, met à jour ou supprime un collaborateur
    """
    try:
        collaborateur = Collaborateur.objects.get(pk=pk)
    except Collaborateur.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = CollaborateurSerializer(collaborateur)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = CollaborateurSerializer(collaborateur, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        collaborateur.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def collaborateurs_by_role(request, role):
    """
    Liste tous les collaborateurs ayant un rôle spécifique
    """
    try:
        collaborateurs = Collaborateur.objects.filter(Role=role.upper())
        serializer = CollaborateurSerializer(collaborateurs, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)