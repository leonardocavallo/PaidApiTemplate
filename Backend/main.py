from flask import Flask, request, jsonify, redirect, send_from_directory
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os 
from dotenv import load_dotenv
from Backend.routes.auth import auth_bp
from Backend.routes.account import account_bp
from Backend.routes.endpoints import endpoints_bp
from Backend.routes.payment import payment_bp
from pathlib import Path

load_dotenv()


JWT_KEY = os.getenv('JWT_SECRET_KEY')

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = JWT_KEY
jwt = JWTManager(app)

#@app.after_request # Only to dev using react local server
#def add_cors_headers(response):
#    response.headers['Access-Control-Allow-Origin'] = '*'
#    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
#    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, x-captcha-token'
#    return response

app.register_blueprint(auth_bp)
app.register_blueprint(account_bp)
app.register_blueprint(endpoints_bp)
app.register_blueprint(payment_bp)

# --- Route to serve React Single Page Application ---
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    static_dir = Path(app.static_folder)
    file_path = static_dir / path
    if path != "" and file_path.exists():
        return send_from_directory(static_dir, path)
    else:
        return send_from_directory(static_dir, "index.html")