from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from ..models import Contact
from ..serializers import ContactSerializer

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def contact_list(request):
    """
    Liste tous les messages de contact ou crée un nouveau message
    """
    if request.method == 'GET':
        contacts = Contact.objects.all()
        serializer = ContactSerializer(contacts, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Votre message a été envoyé avec succès!",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def contact_detail(request, pk):
    """
    Récupère, met à jour ou supprime un message de contact
    """
    try:
        contact = Contact.objects.get(pk=pk)
    except Contact.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = ContactSerializer(contact)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = ContactSerializer(contact, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        contact.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['PUT'])
def contact_marquer_traite(request, pk):
    """
    Marque un message de contact comme traité
    """
    try:
        contact = Contact.objects.get(pk=pk)
        contact.traite = True
        contact.save()
        return Response({
            "message": "Message marqué comme traité",
            "data": ContactSerializer(contact).data
        })
    except Contact.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)