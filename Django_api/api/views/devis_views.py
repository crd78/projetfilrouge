from ..models import DetailsCommande
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Devis, Product,StockMouvement, Entrepot
from ..serializers import DevisSerializer
from ..tasks import update_devis_task, accepter_devis_task  # Ajoute cet import
from .stockmouvement_view import get_stock_produit_entrepot


@api_view(['GET', 'PUT', 'DELETE'])
def devis_detail(request, id):
    try:
        devis = Devis.objects.get(pk=id)
    except Devis.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        details = DetailsCommande.objects.filter(IdDevis=devis)
        produits = []
        for detail in details:
            produit = detail.IdProduit
            produits.append({
                "id": produit.IdProduit,
                "nom": produit.NomProduit,
                "PrixHT": float(produit.PrixHT),
                "PrixTTC": float(produit.PrixTTC),
                "quantite": detail.Quantite
            })
        devis_data = DevisSerializer(devis).data
        devis_data['produits'] = produits
        return Response(devis_data)
    
    elif request.method == 'PUT':
        try:
            print("Début PUT devis_detail pour devis", id)
            approuver = request.data.get('Approuver', False)
            print("Valeur Approuver reçue :", approuver)

            # Met à jour les autres champs du devis (dont idCommercial)
            serializer = DevisSerializer(devis, data=request.data, partial=True)
            if serializer.is_valid():
                devis = serializer.save()
            else:
                print("Erreur serializer:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            if approuver and not devis.Approuver:
                devis.Approuver = True
                devis.save()
                print("Devis approuvé :", devis.IdDevis)
            else:
                print("Aucune opération de stock, devis déjà approuvé ou non demandé")
            print("Fin PUT devis_detail pour devis", id)
            return Response(DevisSerializer(devis).data)
        except Exception as e:
            print("Erreur PUT devis_detail:", str(e))
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'POST'])
def devis_list(request):
    if request.method == 'GET':
        approuver = request.GET.get('Approuver')
        devis = Devis.objects.all()
        if approuver is not None:
            approuver_bool = approuver.lower() in ['true', '1', 'yes']
            devis = devis.filter(Approuver=approuver_bool)
        serializer = DevisSerializer(devis, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        produits = request.data.pop('produits', [])
        # produits doit être une liste d'objets {id, quantite}
        serializer = DevisSerializer(data=request.data)
        if serializer.is_valid():
            devis = serializer.save()
            for prod in produits:
                DetailsCommande.objects.create(
                    IdDevis=devis,
                    IdProduit_id=prod['id'],
                    Quantite=prod.get('quantite', 1)
                )
            return Response(DevisSerializer(devis).data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def devis_accepter(request, id):
    """
    Permet à un boulanger d'accepter un devis validé par le commercial.
    """
    try:
        # Vérifie d'abord si le devis existe
        devis = Devis.objects.get(pk=id)
        
        # Envoie la tâche à Celery pour traitement asynchrone
        task = accepter_devis_task.delay(id)
        
        # Récupère les données actuelles pour la réponse
        current_data = DevisSerializer(devis).data
        
        return Response({
            "message": f"Traitement de l'acceptation du devis {id} en cours",
            "task_id": task.id,
            "current_data": current_data
        })
    except Devis.DoesNotExist:
        return Response({"error": "Devis non trouvé"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)