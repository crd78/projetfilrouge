import pymongo
import json
from datetime import datetime

def check_mongo_db():
    myclient = pymongo.MongoClient("mongodb://mongadmin:1234@mongo:27017/?authSource=admin")
    dbnames = myclient.list_database_names()
    mydb_name = "minot_or_stats"

    if mydb_name not in dbnames:
        mydb = myclient[mydb_name]
        print(f"Base de données '{mydb_name}' créée.")

        json_file_path = r'./default_stats.json'

        with open(json_file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            print("Data loaded")

        if isinstance(data, list):
            for doc in data:
                if "visit_date" in doc and isinstance(doc["visit_date"], str):
                    try:
                        doc["visit_date"] = datetime.fromisoformat(doc["visit_date"])
                    except ValueError:
                        print(f"Date invalide dans le document : {doc['_id']}")
                        doc["visit_date"] = None 

            collection = mydb["stats"]
            collection.insert_many(data)
            print("Données importées avec succès avec conversion des dates.")
        else:
            print("Le fichier JSON ne contient pas une liste de documents.")
    else:
        mydb = myclient[mydb_name]
        print(f"Base de données '{mydb_name}' existe déjà.")
