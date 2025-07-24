from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import StockMouvement
from ..serializers import StockMouvementSerializer

@api_view(['GET', 'POST'])
def stockmouvement_list(request):
    if request.method == 'GET':
        mouvements = StockMouvement.objects.all()
        serializer = StockMouvementSerializer(mouvements, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = StockMouvementSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
def get_stock_produit_entrepot(id_produit, id_entrepot):
    mouvements = StockMouvement.objects.filter(IdProduit=id_produit, IdEntrepot=id_entrepot)
    quantite = sum([m.Quantite if m.TypeMouvement in ['ENTREE', 'RETOUR'] else -m.Quantite for m in mouvements])
    return quantite