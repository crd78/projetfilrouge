from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Commande
from ..serializers import CommandeSerializer
from ..tasks import update_commande_task, commande_payer_task, commande_livrer_task
import sys

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
def commandes_for_stock_manager(request):
    """
    Liste les commandes pour le chargé de stock avec possibilité de filtrer
    """
    # Filtres possibles
    statut = request.GET.get('statut')
    date_debut = request.GET.get('date_debut')
    date_fin = request.GET.get('date_fin')
    client_id = request.GET.get('client_id')
    
    # Requête de base - exclure les commandes annulées et déjà livrées
    commandes = Commande.objects.exclude(Statut__in=['ANNULEE', 'LIVREE'])
    
    # Appliquer les filtres
    if statut:
        commandes = commandes.filter(Statut=statut.upper())
    if date_debut:
        commandes = commandes.filter(DateCommande__date__gte=date_debut)
    if date_fin:
        commandes = commandes.filter(DateCommande__date__lte=date_fin)
    if client_id:
        commandes = commandes.filter(IdClient=client_id)
    
    # Ordonner par date de commande (plus récent en premier)
    commandes = commandes.order_by('-DateCommande')
    
    serializer = CommandeSerializer(commandes, many=True)
    return Response({
        'count': commandes.count(),
        'commandes': serializer.data
    })

@api_view(['POST'])
def creer_livraison_depuis_commande(request):
    """
    Crée une livraison à partir d'une commande pour le chargé de stock
    """
    print("DEBUG creer_livraison_depuis_commande payload:", request.data)
    commande_id = request.data.get('commande_id')
    entrepot_id = request.data.get('entrepot_id')
    vehicule_id = request.data.get('vehicule_id')
    date_prevue = request.data.get('date_prevue', None)
    commentaire = request.data.get('commentaire', '')

    # Nouveaux paramètres transport
    distance = request.data.get('distance')
    cout_kilometre = request.data.get('cout_kilometre')
    frais_fixes = request.data.get('frais_fixes')
    prix_total = request.data.get('prix_total')

    print(f"Valeurs reçues - commande_id: {commande_id}, entrepot_id: {entrepot_id}, vehicule_id: {vehicule_id}, distance: {distance}, cout_kilometre: {cout_kilometre}, frais_fixes: {frais_fixes}, prix_total: {prix_total}")

    # Validation stricte : véhicule obligatoire
    if not commande_id or not entrepot_id or not vehicule_id:
        print("Validation échouée - données manquantes")
        return Response({'error': 'commande_id, entrepot_id et vehicule_id sont requis'}, 
                       status=status.HTTP_400_BAD_REQUEST)

    # Vérif des paramètres transport
    if distance is None or cout_kilometre is None or frais_fixes is None or prix_total is None:
        print("Validation échouée - paramètres transport manquants")
        return Response({'error': 'distance, cout_kilometre, frais_fixes et prix_total sont requis'}, 
                       status=status.HTTP_400_BAD_REQUEST)

    try:
        print(f"Recherche de la commande {commande_id}...")
        commande = Commande.objects.get(pk=commande_id)
        print(f"Commande trouvée: {commande}")

        # Vérifier que le véhicule existe
        from ..models import Vehicule
        try:
            vehicule = Vehicule.objects.get(pk=vehicule_id)
            print(f"Véhicule trouvé: {vehicule.Immatriculation}")
        except Vehicule.DoesNotExist:
            print(f"ERREUR: Véhicule {vehicule_id} n'existe pas")
            return Response({'error': f'Vehicule {vehicule_id} non trouvé'}, 
                           status=status.HTTP_404_NOT_FOUND)

        # Vérifier que l'entrepôt existe
        from ..models import Entrepot
        try:
            entrepot = Entrepot.objects.get(pk=entrepot_id)
            print(f"Entrepôt trouvé: {entrepot.Localisation}")
        except Entrepot.DoesNotExist:
            print(f"ERREUR: Entrepôt {entrepot_id} n'existe pas")
            return Response({'error': f'Entrepôt {entrepot_id} non trouvé'}, 
                           status=status.HTTP_404_NOT_FOUND)

        # Créer la livraison
        from ..models import Livraison, Transport

        print("Création du transport...")
        transport = Transport.objects.create(
            CoutKilometre=cout_kilometre,
            FraisFixes=frais_fixes,
            Distance=distance,
            CoutTotal=prix_total,  
            IdVehicule_id=vehicule_id,
            Commentaire=f"Transport pour commande #{commande_id}"
        )
        print(f"Transport créé: {transport}")

        print("Création de la livraison...")
        print(f"Tentative avec vehicule_id={vehicule_id} (type: {type(vehicule_id)})")

        livraison = Livraison.objects.create(
            IdCommande=commande,
            IdTransport=transport,
            IdEntrepot_id=entrepot_id,
            IdVehicule_id=vehicule_id,
            DatePrevue=date_prevue,
            Commentaire=commentaire,
            Statut='PREPARATION'
        )
        print(f"Livraison créée: {livraison}")

        # Mettre à jour le statut de la commande
        commande.Statut = 'EN_COURS'
        commande.save()
        print("Statut commande mis à jour")

        from ..serializers import LivraisonSerializer
        serializer = LivraisonSerializer(livraison)
        return Response({
            'message': 'Livraison créée avec succès',
            'livraison': serializer.data
        }, status=status.HTTP_201_CREATED)

    except Commande.DoesNotExist:
        print("Commande non trouvée")
        return Response({'error': 'Commande non trouvée'}, 
                       status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print("ERREUR lors de la création:", str(e))
        import traceback
        traceback.print_exc()
        return Response({'error': str(e)}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)