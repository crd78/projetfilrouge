from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Commande
from ..serializers import CommandeSerializer
from ..tasks import update_commande_task, commande_payer_task, commande_livrer_task

@api_view(['GET', 'POST'])
def commande_list(request):
    """
    Liste toutes les commandes ou crée une nouvelle commande
    """
    if request.method == 'GET':
        commandes = Commande.objects.all()
        serializer = CommandeSerializer(commandes, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = CommandeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def commande_detail(request, id):
    """
    Récupère, met à jour ou supprime une commande
    """
    try:
        commande = Commande.objects.get(pk=id)
    except Commande.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = CommandeSerializer(commande)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        # Envoie la tâche à Celery pour traitement asynchrone
        task = update_commande_task.delay(id, request.data)
        
        # Récupère les données actuelles pour la réponse
        current_data = CommandeSerializer(commande).data
        
        return Response({
            "message": f"Mise à jour de la commande {id} en cours",
            "task_id": task.id,
            "current_data": current_data
        })
    
    elif request.method == 'DELETE':
        commande.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def client_commandes_list(request, client_id):
    """
    Liste toutes les commandes d'un client spécifique
    """
    try:
        commandes = Commande.objects.filter(IdClient=client_id)
        serializer = CommandeSerializer(commandes, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def commandes_by_status(request, statut):
    """
    Liste toutes les commandes ayant un statut spécifique
    """
    try:
        commandes = Commande.objects.filter(Statut=statut.upper())
        serializer = CommandeSerializer(commandes, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['PUT'])
def commande_payer(request, id):
    """
    Permet à un boulanger de marquer une commande comme payée après le virement bancaire.
    """
    try:
        # Vérifie d'abord si la commande existe
        commande = Commande.objects.get(pk=id)
        
        # Envoie la tâche à Celery pour traitement asynchrone
        task = commande_payer_task.delay(id)
        
        # Récupère les données actuelles pour la réponse
        current_data = CommandeSerializer(commande).data
        
        return Response({
            "message": f"Traitement du paiement de la commande {id} en cours",
            "task_id": task.id,
            "current_data": current_data
        })
    except Commande.DoesNotExist:
        return Response({"error": "Commande non trouvée"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def commande_livrer(request, id):
    """
    Permet de marquer une commande comme livrée par le livreur.
    """
    try:
        # Vérifie d'abord si la commande existe
        commande = Commande.objects.get(pk=id)
        
        # Envoie la tâche à Celery pour traitement asynchrone
        task = commande_livrer_task.delay(id)
        
        # Récupère les données actuelles pour la réponse
        current_data = CommandeSerializer(commande).data
        
        return Response({
            "message": f"Traitement de la livraison de la commande {id} en cours",
            "task_id": task.id,
            "current_data": current_data
        })
    except Commande.DoesNotExist:
        return Response({"error": "Commande non trouvée"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def check_commande_task(request, task_id):
    """
    Vérifie l'état d'une tâche liée à une commande
    """
    from celery.result import AsyncResult
    
    task_result = AsyncResult(task_id)
    
    if task_result.ready():
        if task_result.successful():
            result = task_result.result
            if result.get('success'):
                return Response({
                    "status": "completed",
                    "result": result
                })
            else:
                return Response({
                    "status": "failed",
                    "errors": result.get('errors') or result.get('error')
                }, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                "status": "failed",
                "error": str(task_result.result)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({
            "status": "pending",
            "message": "La tâche est toujours en cours"
        })