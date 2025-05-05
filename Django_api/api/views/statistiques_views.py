from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Commande, Livraison
from django.db.models import Count, Avg, Sum
from django.utils import timezone
from datetime import timedelta

@api_view(['GET'])
def statistiques_visites(request):
    """
    Permet de récupérer les statistiques des pages visitées sur le site
    pour l'analyse de performance.
    """
    # Simulons des statistiques, car ce serait normalement 
    # implémenté avec un outil d'analyse comme Google Analytics
    return Response({
        "message": "Statistiques de visites",
        "pages_populaires": [
            {"url": "/produits", "visites": 1250},
            {"url": "/minoteries", "visites": 780},
            {"url": "/devis", "visites": 450},
        ]
    })

@api_view(['GET'])
def statistiques_performances(request):
    """
    Permet d'analyser les performances du système (par exemple, nombre de commandes 
    par jour, délai de livraison moyen, etc.).
    """
    # Date d'aujourd'hui
    today = timezone.now()
    # Date d'il y a 30 jours
    last_month = today - timedelta(days=30)
    
    # Statistiques simulées - à adapter selon vos modèles réels
    try:
        # Nombre de commandes au cours du dernier mois
        commandes_mois = Commande.objects.filter(DateCommande__gte=last_month).count()
        
        # Statistiques de traitement des commandes
        commandes_par_statut = Commande.objects.values('Statut').annotate(
            total=Count('IdCommande')
        )
        
        # Montant total des commandes ce mois-ci
        montant_total = Commande.objects.filter(DateCommande__gte=last_month).aggregate(
            total_ht=Sum('MontantTotalHT'),
            total_ttc=Sum('MontantTotalTTC')
        )
        
        # Délai moyen de livraison (en jours)
        delai_moyen = "2.5 jours"  # Valeur simulée
        
        return Response({
            "periode": {
                "debut": last_month.strftime("%Y-%m-%d"),
                "fin": today.strftime("%Y-%m-%d")
            },
            "commandes": {
                "total": commandes_mois,
                "par_statut": list(commandes_par_statut),
                "montant_total_ht": montant_total['total_ht'] if montant_total['total_ht'] else 0,
                "montant_total_ttc": montant_total['total_ttc'] if montant_total['total_ttc'] else 0,
            },
            "livraison": {
                "delai_moyen": delai_moyen
            }
        })
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)