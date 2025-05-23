from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.permissions import AllowAny
from check_mongo_db import check_mongo_db
from rest_framework.decorators import api_view,permission_classes
import pymongo
from bson import json_util
from django.http import JsonResponse
from datetime import datetime


def date_format():
    now = datetime.now()
    formatted_date = now.strftime("%Y-%m-%d")
    return formatted_date


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def stats_list(request):
    """
    Liste toutes les stats
    """
    if request.method == 'GET':
        
        check_mongo_db()
        myclient = pymongo.MongoClient("mongodb://mongadmin:1234@mongo:27017/?authSource=admin")
        mydb = myclient["minot_or_stats"]
        mycol = mydb["stats"]
        data = list(mycol.find())

        return JsonResponse(data, safe=False, json_dumps_params={'default': json_util.default})

    elif request.method == 'POST':
            page_name = request.data.get('page_name')

            if not page_name:
                return JsonResponse({"error": "page_name is missing"}, status=400)

            visit_date = date_format()
            doc = {
                "page_name": page_name,
                "visit_date": visit_date
            }

            myclient = pymongo.MongoClient("mongodb://mongadmin:1234@mongo:27017/?authSource=admin")
            mydb = myclient["minot_or_stats"]
            mycol = mydb["stats"]

            try:
                result = mycol.insert_one(doc)
                if result.inserted_id:
                    data = {
                        "page_name": page_name,
                        "visit_date": visit_date,
                    }
                    return JsonResponse(data, safe=False, json_dumps_params={'default': json_util.default})
                else:
                    return JsonResponse({"error": "Insertion failed, no inserted_id returned."}, status=500)
            except Exception as e:
                return JsonResponse({"error": f"Insertion failed: {str(e)}"}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)