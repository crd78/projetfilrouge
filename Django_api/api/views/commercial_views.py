from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import Personne, Devis
from ..serializers import PersonneSerializer, DevisSerializer

@api_view(['GET', 'PUT', 'DELETE'])
def commercial_detail(request, pk):
    """
    Récupère, met à jour ou supprime un commercial.
    Le commercial est une Personne avec role = 2.
    """
    try:
        commercial = Personne.objects.get(pk=pk, role=2)
    except Personne.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = PersonneSerializer(commercial)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = PersonneSerializer(commercial, data=request.data)
        if serializer.is_valid():
            serializer.save(role=2)  # Assurez-vous que le role reste Commercial
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        commercial.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def commercial_devis_list(request, commercial_id):
    """
    Retourne tous les devis associés à un commercial.
    """
    try:
        devis = Devis.objects.filter(idCommercial__id=commercial_id)
        serializer = DevisSerializer(devis, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)