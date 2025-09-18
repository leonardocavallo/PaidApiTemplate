from pymongo import MongoClient, ReturnDocument
from bson.objectid import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
MONGODB_NAME = os.getenv("MONGODB_NAME")

client = MongoClient(MONGODB_URL)
db = client[MONGODB_NAME]
