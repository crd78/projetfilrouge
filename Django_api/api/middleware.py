# filepath: c:\Users\suppo\projetfilrouge\Django_api\api\middleware.py
import os

def server_identifier_middleware(get_response):
    server_id = os.environ.get('SERVER_ID', 'unknown')
    
    def middleware(request):
        response = get_response(request)
        response['X-Server-ID'] = server_id
        return response
    
    return middleware