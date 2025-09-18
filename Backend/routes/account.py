from bson import ObjectId
from flask import Blueprint, jsonify, render_template, request, redirect, url_for
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from Backend.extensions import db
from bcrypt import hashpw, gensalt, checkpw
from pymongo import ReturnDocument
import secrets

account_bp = Blueprint('account', __name__, template_folder='templates')
users_collection = db["users"]

@account_bp.route("/api/profile")
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    
    if not current_user:
        return jsonify({"error": "Invalid token"}), 401
    
    user = users_collection.find_one({"discord_id": str(current_user)})
    if user:
        api_keys = user.get("api_keys", [])
        for key in api_keys: #Redact hashed keys
            key.pop("key", None)
            key["_id"] = str(key["_id"])
        user_data = {
            "discord_id": user["discord_id"],
            "email": user.get("email", ""),
            "username": user.get("username", ""),
            "balance": user.get("balance", 0.0),
            "api_keys": api_keys
        }
        return jsonify(user_data), 200
    return jsonify({"error": "User not found"}), 404

@account_bp.route("/api/apikey/create", methods=["POST"])
@jwt_required()
def create_api_key():
    current_user = get_jwt_identity()
    
    if not current_user:
        return jsonify({"error": "Invalid token"}), 401
    
    if not "label" in request.json:
        return jsonify({"error": "Label is required"}), 400
    
    if request.json["label"].strip() == "":
        return jsonify({"error": "Label cannot be empty"}), 400
    
    if len(request.json["label"]) > 20:
        return jsonify({"error": "Label is too long (max 20 characters)"}), 400

    user = users_collection.find_one({"discord_id": str(current_user)})
    if user:
        label = request.json.get("label")
        api_key = secrets.token_hex(32)
        api_key_id = ObjectId() #Non è una stringa quindi va convertita nella risposta
        # PS: per eliminare usare ObjectId.is_valid(id_str) per validare
        api_key_hashed = hashpw(api_key.encode(), gensalt())
    
        api_key_obj = {
            "_id": api_key_id,
            "label": label,
            "key": api_key_hashed
        }

        users_collection.update_one(
            {"discord_id": str(current_user)},
            {"$push": {"api_keys": api_key_obj}}
        )
        return jsonify({"id": str(api_key_id),"api_key": api_key}), 201 #

    return jsonify({"error": "User not found"}), 404

@account_bp.route("/api/apikey/delete", methods=["POST"])
@jwt_required()
def delete_api_key():
    current_user = get_jwt_identity()

    if not current_user:
        return jsonify({"error": "Invalid token"}), 401

    if not "id" in request.json:
        return jsonify({"error": "API key ID is required"}), 400

    if not ObjectId.is_valid(request.json["id"]):
        return jsonify({"error": "Invalid API key ID"}), 400

    api_key_id = request.json["id"]

    user = users_collection.find_one({"discord_id": str(current_user)})
    if user:
        users_collection.update_one(
            {"discord_id": str(current_user)},
            {"$pull": {"api_keys": {"_id": ObjectId(api_key_id)}}}
        ) #Se non esiste non fa nulla :(
        return jsonify({"message": "API key deleted successfully"}), 200
    return jsonify({"error": "User not found"}), 404

@account_bp.route("/api/apikey/list")
@jwt_required()
def list_api_keys():
    current_user = get_jwt_identity()

    if not current_user:
        return jsonify({"error": "Invalid token"}), 401

    user = users_collection.find_one({"discord_id": str(current_user)})
    if user:
        api_keys = user.get("api_keys", []) 
        for key in api_keys: #Redact hashed keys
            key.pop("key", None)
            key["_id"] = str(key["_id"]) #Convert ObjectId to string for JSON serialization
        return jsonify({"api_keys": api_keys}), 200
    return jsonify({"error": "User not found"}), 404