from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import DetailsCommande, Commande, Product
from ..serializers import DetailsCommandeSerializer, ProductSerializer
from ..tasks import update_details_commande_task


@api_view(['GET', 'POST'])
def details_commande_list(request):
    """
    Liste tous les détails de commandes ou crée un nouveau détail
    """
    if request.method == 'GET':
        details = DetailsCommande.objects.all()
        serializer = DetailsCommandeSerializer(details, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = DetailsCommandeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def details_commande_detail(request, id):
    """
    Récupère, met à jour ou supprime un détail de commande
    """
    try:
        detail = DetailsCommande.objects.get(id=id)
    except DetailsCommande.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = DetailsCommandeSerializer(detail)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        # Envoie la tâche à Celery pour traitement asynchrone
        task = update_details_commande_task.delay(id, request.data)
        
        # Récupère les données actuelles pour la réponse
        current_data = DetailsCommandeSerializer(detail).data
        
        return Response({
            "message": f"Mise à jour du détail de commande {id} en cours",
            "task_id": task.id,
            "current_data": current_data
        })
    
    elif request.method == 'DELETE':
        detail.delete()

@api_view(['GET'])
def afficher_details_commande(request, commande_id):
    """
    Récupère et retourne les détails d'une commande en fonction de IdCommande.
    """
    try:
        details = DetailsCommande.objects.filter(IdCommande=commande_id)
        if not details.exists():
            return Response({"message": "Aucun détail trouvé pour cette commande"}, status=status.HTTP_404_NOT_FOUND)
        
        resultats = []
        for detail in details:
            try:
                produit = Product.objects.get(IdProduit=detail.IdProduit)
                produit_info = {
                    "IdProduit": detail.IdProduit,
                    "NomProduit": produit.NomProduit,
                    "TypeProduit": produit.TypeProduit,
                    "PrixHT": str(produit.PrixHT),
                    "PrixTTC": str(produit.PrixTTC),
                    "Quantite": detail.Quantite,
                    "Total": str(float(produit.PrixTTC) * detail.Quantite)
                }
                resultats.append(produit_info)
            except Product.DoesNotExist:
                # Si le produit n'existe plus, on inclut quand même l'entrée mais avec des infos limitées
                resultats.append({
                    "IdProduit": detail.IdProduit,
                    "NomProduit": "Produit non trouvé",
                    "Quantite": detail.Quantite
                })
        
        return Response({
            "commande_id": commande_id,
            "nombre_produits": len(resultats),
            "details": resultats
        })
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)