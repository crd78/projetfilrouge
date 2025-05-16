import pymongo
import json

# Connect to MongoDB
myclient = pymongo.MongoClient("mongodb://localhost:27017/")
dbnames = myclient.list_database_names()
mydb_name = "minot_or_stats"

if mydb_name not in dbnames:
    mydb = myclient[mydb_name]
    print(f"Base de données '{mydb_name}' créée.")

    json_file_path = r'Django_api\default_stats.json'

    with open(json_file_path, 'r') as file:
        data = json.load(file)
        print("Data loaded")

    if isinstance(data, list):
        collection = mydb["stats"]
        collection.insert_many(data)
        print("Données importées avec succès.")
    else:
        print("Le fichier JSON ne contient pas une liste de documents.")
else:
    mydb = myclient[mydb_name]
    print(f"Base de données '{mydb_name}' existe déjà.")
