from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import Personne
from ..serializers import PersonneSerializer

@api_view(['GET', 'POST'])
def personne_list(request):
    if request.method == 'GET':
        personnes = Personne.objects.all()
        serializer = PersonneSerializer(personnes, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = PersonneSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def personne_detail(request, pk):
    try:
        personne = Personne.objects.get(pk=pk)
    except Personne.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = PersonneSerializer(personne)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = PersonneSerializer(personne, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        personne.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)