from flask import Blueprint, jsonify, render_template, request, redirect, url_for
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from dotenv import load_dotenv
import os
from Backend.extensions import db
from Backend.modules import discord_oauth
from pymongo import ReturnDocument

load_dotenv()

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
REDIRECT_URL = os.getenv("DISCORD_REDIRECT_URL")
DISCORD_API_BASE = "https://discord.com/api"
OAUTH_SCOPE = "identify email"



auth_bp = Blueprint('auth', __name__, template_folder='templates')
discord_oauth = discord_oauth.DiscordOAuth(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
users_collection = db["users"]


@auth_bp.route("/api/discord/callback", methods=["POST"])
def callback():
    code = request.json.get("code")
    if code:
        access_token = discord_oauth.get_access_token(code)
        if not access_token:
            return jsonify({"error": "Failed to retrieve access token"}), 400
        user_info = discord_oauth.get_user_info(access_token)
        if user_info:
            if not "id" in user_info:
                return jsonify({"error": "User ID not found"}), 400
            user_id = user_info["id"]
            email = user_info.get("email", None)
            username = user_info.get("username", None)
            if not username:
                return jsonify({"error": "Username not found"}), 400
            if not users_collection.find_one({"discord_id": user_id}): # New user
                users_collection.insert_one({
                    "discord_id": user_id,
                    "email": email,
                    "username": username,
                    "balance" : 0.0,
                    "api_keys" : []
                })
            else: # Existing user, update info
                users_collection.find_one_and_update(
                    {"discord_id": user_id},
                    {"$set": {"email": email, "username": username}},
                    return_document=ReturnDocument.AFTER
                )
            jwt_token = create_access_token(identity=str(user_id))

            return jsonify({"access_token": jwt_token}), 200
    return jsonify({"error": "Failed to retrieve user information"}), 400

@auth_bp.route("/api/config", methods=["GET"])
def get_config():
    config = {
        "CLIENT_ID": CLIENT_ID,
        "OAUTH_SCOPE": OAUTH_SCOPE,
        "REDIRECT_URL": REDIRECT_URL
    }
    return jsonify(config), 200