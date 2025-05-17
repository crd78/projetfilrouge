from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from check_mongo_db import check_mongo_db
import pymongo


@api_view(['GET', 'POST'])
def stats_list(request):
    """
    Liste toutes les stats
    """
    check_mongo_db()
    if request.method == 'GET':
        
        myclient = pymongo.MongoClient("mongodb://localhost:27018/")
        mydb = myclient["minot_or_stats"]
        mycol = mydb["stats"]
        data = []

        for x in mycol.find():
            data.append(x)

        return data 
    
    # elif request.method == 'POST':
    #     serializer = LivraisonSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)