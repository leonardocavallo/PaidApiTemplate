from flask import Blueprint, jsonify, render_template, request, redirect, url_for
from Backend.extensions import db
from bcrypt import hashpw, gensalt, checkpw
from pymongo import ReturnDocument

endpoints_bp = Blueprint('endpoints', __name__, template_folder='templates')

users_collection = db["users"]

@endpoints_bp.route("/api/apikey/test")
def test_api_key():
    API_CALL_PRICE = 0.01  # Example price per API call
    if not "x-api-key" in request.headers:
        return jsonify({"error": "API key is required"}), 400
    if not "x-api-userid" in request.headers:
        return jsonify({"error": "User ID is required"}), 400
    api_key = request.headers.get("x-api-key")
    user_id = request.headers.get("x-api-userid")
    user = users_collection.find_one({"discord_id": str(user_id)})
    if user:
        if user.get("balance", 0) < API_CALL_PRICE: #Check if user can afford the call
            return jsonify({"error": "Insufficient balance"}), 402
        for key_obj in user["api_keys"]:
            if checkpw(api_key.encode(), key_obj["key"]):
                users_collection.update_one( # Deduct the price from user's balance
                    {"discord_id": str(user_id)},
                    {"$inc": {"balance": -API_CALL_PRICE}}
                )
                return jsonify({"message": "API key is valid"}), 200
    return jsonify({"error": "Invalid API key or User ID"}), 401