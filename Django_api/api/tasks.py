from celery import shared_task
from .models import Livraison
from datetime import datetime

#test celery
@shared_task
def addition(x, y):
    print(f"Addition: {x} + {y} = {x + y}")
    return x + y

@shared_task
def update_livraison_status_task(livraison_id, statut):
    """Tâche Celery pour mettre à jour le statut d'une livraison en arrière-plan"""
    try:
        livraison = Livraison.objects.get(pk=livraison_id)
        livraison.Statut = statut.upper()
        livraison.save()
        return f"Livraison {livraison_id} mise à jour avec statut {statut}"
    except Livraison.DoesNotExist:
        return f"Erreur: Livraison {livraison_id} non trouvée"
    except Exception as e:
        return f"Erreur lors de la mise à jour: {str(e)}"
    
@shared_task
def process_vehicule_maintenance(vehicule_id, maintenance_data=None, collaborateur_id=None):
    """
    Tâche Celery pour mettre un véhicule en maintenance et créer l'entrée de maintenance
    """
    from .models import Vehicule, Maintenance
    
    try:
        # Récupérer le véhicule
        vehicule = Vehicule.objects.get(pk=vehicule_id)
        
        # Vérifier si le véhicule n'est pas déjà en maintenance
        if vehicule.Statut == 'EN_MAINTENANCE':
            return {
                "success": False,
                "error": "Ce véhicule est déjà en maintenance"
            }
        
        # Mettre à jour le statut du véhicule
        vehicule.Statut = 'EN_MAINTENANCE'
        vehicule.save()
        
        # Créer une entrée de maintenance si des données sont fournies
        if maintenance_data:
            maintenance = Maintenance(
                IdVehicule=vehicule,
                DateMaintenance=datetime.now(),
                TypeMaintenance=maintenance_data.get('type', 'REVISION'),
                Description=maintenance_data.get('description', ''),
                StatutMaintenance='PLANIFIEE',
                IdCollaborateur_id=maintenance_data.get('collaborateur_id', collaborateur_id)
            )
            maintenance.save()
            
            return {
                "success": True,
                "message": "Véhicule mis en maintenance avec succès et maintenance créée",
                "vehicule_id": vehicule.id
            }
        
        return {
            "success": True,
            "message": "Véhicule mis en maintenance avec succès",
            "vehicule_id": vehicule.id
        }
    
    except Vehicule.DoesNotExist:
        return {
            "success": False,
            "error": f"Véhicule {vehicule_id} non trouvé"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@shared_task
def update_vehicule_task(vehicule_id, data):
    """
    Tâche Celery pour mettre à jour les informations d'un véhicule de manière asynchrone
    """
    from .models import Vehicule
    from .serializers import VehiculeSerializer
    
    try:
        vehicule = Vehicule.objects.get(pk=vehicule_id)
        serializer = VehiculeSerializer(vehicule, data=data)
        
        if serializer.is_valid():
            serializer.save()
            return {
                "success": True,
                "message": f"Véhicule {vehicule_id} mis à jour avec succès",
                "data": serializer.data
            }
        else:
            return {
                "success": False,
                "errors": serializer.errors
            }
    except Vehicule.DoesNotExist:
        return {
            "success": False,
            "error": f"Véhicule {vehicule_id} non trouvé"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@shared_task
def update_transport_status_task(transport_id, data):
    """
    Tâche Celery pour mettre à jour le statut d'un transport de manière asynchrone
    """
    from .models import Transport
    from .serializers import TransportSerializer
    
    try:
        transport = Transport.objects.get(pk=transport_id)
        
        # Mettons à jour les champs requis pour le statut
        if 'status' in data:
            status_value = data['status'].upper()
            
            # Mettre à jour les dates de début ou fin en fonction du statut
            if status_value == "EN_COURS" and not transport.DateDebut:
                transport.DateDebut = datetime.now()
            elif (status_value == "LIVRÉ" or status_value == "LIVRE") and not transport.DateFin:
                transport.DateFin = datetime.now()
        
        # Mettre à jour le transport avec les données
        serializer = TransportSerializer(transport, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return {
                "success": True,
                "message": f"Transport {transport_id} mis à jour avec succès",
                "data": serializer.data
            }
        else:
            return {
                "success": False,
                "errors": serializer.errors
            }
    except Transport.DoesNotExist:
        return {
            "success": False,
            "error": f"Transport {transport_id} non trouvé"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
    
@shared_task
def update_ristourne_task(ristourne_id, data):
    """
    Tâche Celery pour mettre à jour une ristourne de manière asynchrone
    """
    from .models import Ristourne
    from .serializers import RistourneSerializer
    
    try:
        ristourne = Ristourne.objects.get(pk=ristourne_id)
        serializer = RistourneSerializer(ristourne, data=data)
        
        if serializer.is_valid():
            serializer.save()
            return {
                "success": True,
                "message": f"Ristourne {ristourne_id} mise à jour avec succès",
                "data": serializer.data
            }
        else:
            return {
                "success": False,
                "errors": serializer.errors
            }
    except Ristourne.DoesNotExist:
        return {
            "success": False,
            "error": f"Ristourne {ristourne_id} non trouvée"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
    
@shared_task
def update_product_task(product_id, data):
    """
    Tâche Celery pour mettre à jour un produit de manière asynchrone
    """
    from .models import Product
    from .serializers import ProductSerializer
    
    try:
        product = Product.objects.get(pk=product_id)
        serializer = ProductSerializer(product, data=data)
        
        if serializer.is_valid():
            serializer.save()
            return {
                "success": True,
                "message": f"Produit {product_id} mis à jour avec succès",
                "data": serializer.data
            }
        else:
            return {
                "success": False,
                "errors": serializer.errors
            }
    except Product.DoesNotExist:
        return {
            "success": False,
            "error": f"Produit {product_id} non trouvé"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


@shared_task
def update_client_task(client_id, data):
    """
    Tâche Celery pour mettre à jour un client de manière asynchrone
    """
    from .models import Personne
    from .serializers import PersonneSerializer
    
    try:
        client = Personne.objects.get(pk=client_id, role=1)
        serializer = PersonneSerializer(client, data=data)
        
        if serializer.is_valid():
            serializer.save()
            return {
                "success": True,
                "message": f"Client {client_id} mis à jour avec succès",
                "data": serializer.data
            }
        else:
            return {
                "success": False,
                "errors": serializer.errors
            }
    except Personne.DoesNotExist:
        return {
            "success": False,
            "error": f"Client {client_id} non trouvé"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@shared_task
def update_commercial_task(commercial_id, data):
    """
    Tâche Celery pour mettre à jour un commercial de manière asynchrone
    """
    from .models import Personne
    from .serializers import PersonneSerializer
    
    try:
        commercial = Personne.objects.get(pk=commercial_id, Role=2)
        serializer = PersonneSerializer(commercial, data=data)
        
        if serializer.is_valid():
            serializer.save()
            return {
                "success": True,
                "message": f"Commercial {commercial_id} mis à jour avec succès",
                "data": serializer.data
            }
        else:
            return {
                "success": False,
                "errors": serializer.errors
            }
    except Personne.DoesNotExist:
        return {
            "success": False,
            "error": f"Commercial {commercial_id} non trouvé"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@shared_task
def update_fournisseur_task(fournisseur_id, data):
    """
    Tâche Celery pour mettre à jour un fournisseur de manière asynchrone
    """
    from .models import Personne
    from .serializers import PersonneSerializer
    
    try:
        fournisseur = Personne.objects.get(pk=fournisseur_id, role=3)
        serializer = PersonneSerializer(fournisseur, data=data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return {
                "success": True,
                "message": f"Fournisseur {fournisseur_id} mis à jour avec succès",
                "data": serializer.data
            }
        else:
            return {
                "success": False,
                "errors": serializer.errors
            }
    except Personne.DoesNotExist:
        return {
            "success": False,
            "error": f"Fournisseur {fournisseur_id} non trouvé"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
    

@shared_task
def update_maintenance_task(maintenance_id, data):
    """
    Tâche Celery pour mettre à jour une maintenance de manière asynchrone
    """
    from .models import Maintenance
    from .serializers import MaintenanceSerializer
    
    try:
        maintenance = Maintenance.objects.get(pk=maintenance_id)
        serializer = MaintenanceSerializer(maintenance, data=data)
        
        if serializer.is_valid():
            serializer.save()
            return {
                "success": True,
                "message": f"Maintenance {maintenance_id} mise à jour avec succès",
                "data": serializer.data
            }
        else:
            return {
                "success": False,
                "errors": serializer.errors
            }
    except Maintenance.DoesNotExist:
        return {
            "success": False,
            "error": f"Maintenance {maintenance_id} non trouvée"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@shared_task
def update_maintenance_status_task(maintenance_id, statut):
    """
    Tâche Celery pour mettre à jour le statut d'une maintenance de manière asynchrone
    """
    from .models import Maintenance
    from .serializers import MaintenanceSerializer
    
    try:
        maintenance = Maintenance.objects.get(pk=maintenance_id)
        maintenance.StatutMaintenance = statut.upper()
        
        # Si la maintenance est terminée, mettre à jour la date de fin
        if statut.upper() == 'TERMINEE' and not maintenance.DateFinMaintenance:
            maintenance.DateFinMaintenance = datetime.now()
            
        maintenance.save()
        serializer = MaintenanceSerializer(maintenance)
        
        return {
            "success": True,
            "message": f"Statut de la maintenance {maintenance_id} mis à jour avec succès",
            "data": serializer.data
        }
    except Maintenance.DoesNotExist:
        return {
            "success": False,
            "error": f"Maintenance {maintenance_id} non trouvée"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }



@shared_task
def update_livreur_task(livreur_id, data):
    """
    Tâche Celery pour mettre à jour un livreur de manière asynchrone
    """
    from .models import Livreur
    from .serializers import LivreurSerializer
    
    try:
        livreur = Livreur.objects.get(pk=livreur_id)
        serializer = LivreurSerializer(livreur, data=data)
        
        if serializer.is_valid():
            serializer.save()
            return {
                "success": True,
                "message": f"Livreur {livreur_id} mis à jour avec succès",
                "data": serializer.data
            }
        else:
            return {
                "success": False,
                "errors": serializer.errors
            }
    except Livreur.DoesNotExist:
        return {
            "success": False,
            "error": f"Livreur {livreur_id} non trouvé"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@shared_task
def terminer_livraison_task(livreur_id, livraison_data):
    """
    Tâche Celery pour marquer une livraison comme terminée
    """
    from .models import Livreur, Livraison
    
    try:
        livreur = Livreur.objects.get(pk=livreur_id)
        
        if 'livraison_id' not in livraison_data:
            return {
                "success": False,
                "error": "ID de livraison manquant"
            }
            
        livraison = Livraison.objects.get(pk=livraison_data['livraison_id'])
        livraison.Statut = 'LIVREE'
        livraison.DateLivraison = datetime.now()
        livraison.save()
        
        # Mise à jour du statut de la commande associée si nécessaire
        commande = livraison.IdCommande
        commande.Statut = 'LIVREE'
        commande.save()
        
        return {
            "success": True,
            "message": f"Livraison #{livraison.IdLivraison} marquée comme terminée par le livreur {livreur.Prenom} {livreur.Nom}",
            "date_livraison": livraison.DateLivraison.strftime('%Y-%m-%d %H:%M:%S'),
            "statut": livraison.Statut
        }
    except Livreur.DoesNotExist:
        return {
            "success": False,
            "error": f"Livreur {livreur_id} non trouvé"
        }
    except Livraison.DoesNotExist:
        return {
            "success": False,
            "error": f"Livraison {livraison_data.get('livraison_id')} non trouvée"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@shared_task
def update_livraison_task(livraison_id, data):
    """
    Tâche Celery pour mettre à jour une livraison de manière asynchrone
    """
    from .models import Livraison
    from .serializers import LivraisonSerializer
    
    try:
        livraison = Livraison.objects.get(pk=livraison_id)
        serializer = LivraisonSerializer(livraison, data=data)
        
        if serializer.is_valid():
            serializer.save()
            return {
                "success": True,
                "message": f"Livraison {livraison_id} mise à jour avec succès",
                "data": serializer.data
            }
        else:
            return {
                "success": False,
                "errors": serializer.errors
            }
    except Livraison.DoesNotExist:
        return {
            "success": False,
            "error": f"Livraison {livraison_id} non trouvée"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@shared_task
def update_entrepot_task(entrepot_id, data):
    """
    Tâche Celery pour mettre à jour un entrepôt de manière asynchrone
    """
    from .models import Entrepot
    from .serializers import EntrepotSerializer
    
    try:
        entrepot = Entrepot.objects.get(pk=entrepot_id)
        serializer = EntrepotSerializer(entrepot, data=data)
        
        if serializer.is_valid():
            serializer.save()
            return {
                "success": True,
                "message": f"Entrepôt {entrepot_id} mis à jour avec succès",
                "data": serializer.data
            }
        else:
            return {
                "success": False,
                "errors": serializer.errors
            }
    except Entrepot.DoesNotExist:
        return {
            "success": False,
            "error": f"Entrepôt {entrepot_id} non trouvé"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@shared_task
def update_devis_task(devis_id, data):
    """
    Tâche Celery pour mettre à jour un devis de manière asynchrone
    """
    from .models import Devis
    from .serializers import DevisSerializer
    
    try:
        devis = Devis.objects.get(pk=devis_id)
        serializer = DevisSerializer(devis, data=data)
        
        if serializer.is_valid():
            serializer.save()
            return {
                "success": True,
                "message": f"Devis {devis_id} mis à jour avec succès",
                "data": serializer.data
            }
        else:
            return {
                "success": False,
                "errors": serializer.errors
            }
    except Devis.DoesNotExist:
        return {
            "success": False,
            "error": f"Devis {devis_id} non trouvé"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@shared_task
def accepter_devis_task(devis_id):
    """
    Tâche Celery pour accepter un devis et créer une commande
    """
    from .models import Devis, Commande
    from .serializers import DevisSerializer, CommandeSerializer
    
    try:
        devis = Devis.objects.get(pk=devis_id)
        
        # Mettre à jour le statut du devis pour indiquer qu'il est accepté
        devis.Statut = 'ACCEPTE'  # Assurez-vous que ce champ existe dans votre modèle
        devis.save()
        
        # Créer une commande à partir du devis
        nouvelle_commande = Commande.objects.create(
            IdClient=devis.IdClient,
            MontantTotalHT=devis.MontantTotalHT,
            MontantTotalTTC=devis.MontantTotalTTC,
            Statut='CREEE',
            # Autres champs nécessaires selon votre modèle
        )
        
        devis_serializer = DevisSerializer(devis)
        
        return {
            "success": True,
            "message": "Devis accepté avec succès",
            "devis": devis_serializer.data,
            "commande": {
                "id": nouvelle_commande.IdCommande,
                "statut": nouvelle_commande.Statut,
                "montant_ht": float(nouvelle_commande.MontantTotalHT),
                "montant_ttc": float(nouvelle_commande.MontantTotalTTC)
            }
        }
    except Devis.DoesNotExist:
        return {
            "success": False,
            "error": f"Devis {devis_id} non trouvé"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


    
@shared_task
def update_details_commande_task(detail_id, data):
    """
    Tâche Celery pour mettre à jour un détail de commande de manière asynchrone
    """
    from .models import DetailsCommande
    from .serializers import DetailsCommandeSerializer
    
    try:
        detail = DetailsCommande.objects.get(id=detail_id)
        serializer = DetailsCommandeSerializer(detail, data=data)
        
        if serializer.is_valid():
            serializer.save()
            
            # Recalcule optionnellement les totaux de la commande
            commande = detail.IdCommande
            details = DetailsCommande.objects.filter(IdCommande=commande.IdCommande)
            
            # Exemple de recalcul des totaux (à adapter selon votre logique métier)
            total_ht = sum(detail.Quantite * detail.IdProduit.PrixHT for detail in details)
            total_ttc = sum(detail.Quantite * detail.IdProduit.PrixTTC for detail in details)
            
            # Mise à jour des totaux de la commande
            commande.MontantTotalHT = total_ht
            commande.MontantTotalTTC = total_ttc
            commande.save()
            
            return {
                "success": True,
                "message": f"Détail de commande {detail_id} mis à jour avec succès",
                "data": serializer.data,
                "commande_updated": {
                    "id": commande.IdCommande,
                    "montant_ht": float(commande.MontantTotalHT),
                    "montant_ttc": float(commande.MontantTotalTTC)
                }
            }
        else:
            return {
                "success": False,
                "errors": serializer.errors
            }
    except DetailsCommande.DoesNotExist:
        return {
            "success": False,
            "error": f"Détail de commande {detail_id} non trouvé"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@shared_task
def commande_livrer_task(commande_id):
    """
    Tâche Celery pour marquer une commande comme livrée
    """
    from .models import Commande
    from .serializers import CommandeSerializer
    
    try:
        commande = Commande.objects.get(pk=commande_id)
        commande.Statut = 'LIVREE'
        commande.save()
        
        serializer = CommandeSerializer(commande)
        return {
            "success": True,
            "message": f"Commande {commande_id} marquée comme livrée avec succès",
            "data": serializer.data
        }
    except Commande.DoesNotExist:
        return {
            "success": False,
            "error": f"Commande {commande_id} non trouvée"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }