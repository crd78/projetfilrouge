import time
from collections import Counter
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
import os
import socket

@api_view(['GET'])
@permission_classes([AllowAny])  
@authentication_classes([]) 
def health_check(request):
    """
    retourne l id du serv et l hostname
    """
    server_id = os.environ.get('SERVER_ID', 'unknown')
    hostname = socket.gethostname()
    
    return Response({
        'status': 'healthy',
        'server_id': server_id,
        'hostname': hostname,
    })

@api_view(['GET'])
@permission_classes([AllowAny])
@authentication_classes([])
def simple_test(request):
    """Endpoint ultra simple pour tester le load balancing."""
    server_id = os.environ.get('SERVER_ID', 'unknown')
    return Response({
        'server_id': server_id
    })
