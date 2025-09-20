from flask import Blueprint, jsonify, render_template, request, redirect, url_for
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from dotenv import load_dotenv
import os
from Backend.extensions import db
from pymongo import ReturnDocument
from bson import ObjectId
from Backend.modules import coinbase
from loguru import logger
import hmac
import hashlib

load_dotenv()

COINBASE_WEBHOOK_SECRET = os.getenv("COINBASE_WEBHOOK_SECRET")
COINBASE_API_KEY = os.getenv("COINBASE_API_KEY")
COINBASE_COMPANY_NAME = os.getenv("COINBASE_COMPANY_NAME")
PAYMENTS_ENABLED = os.getenv("ENABLE_PAYMENTS") == "True" # Enable or disable payment features

payment_bp = Blueprint('payment', __name__, template_folder='templates')
users_collection = db["users"]
transactions_collection = db["transactions"]

payments = coinbase.Payments(COINBASE_API_KEY)

@payment_bp.route("/api/balance/recharge", methods=["POST"])
@jwt_required()
def recharge_balance():
    if not PAYMENTS_ENABLED: # Check if payments are enabled
        return jsonify({"error": "Payments are disabled"}), 403

    current_user = get_jwt_identity()

    if not current_user:
        return jsonify({"error": "Invalid token"}), 401

    if not "amount" in request.json:
        return jsonify({"error": "Amount is required"}), 400

    # Validate amount

    if not isinstance(request.json["amount"], (int, float)):
        return jsonify({"error": "Invalid amount"}), 400

    amount = float(request.json["amount"])
    if amount <= 0:
        return jsonify({"error": "Amount must be greater than zero"}), 400


    user = users_collection.find_one({"discord_id": str(current_user)})  # Check whether the user exists
    if user:
        # Create Coinbase Commerce checkout
        description = f"{COINBASE_COMPANY_NAME} Balance Recharge for user {str(current_user)}"
        payment = payments.create_checkout(
            name=f"{COINBASE_COMPANY_NAME} Balance Recharge",
            description=description,
            amount=amount
        )
        if 'error' in payment:
            return jsonify({'error': payment['error']['message'] }), 400
        
        # Log the transaction in the database

        transactions_collection.insert_one({
            "user_id": str(current_user),
            "amount": amount,
            "description": description,
            "payment_id": payment["data"]["id"],
            "status": "created"
        })

        payment_url = payment["data"]["hosted_url"]
        payment_id = payment["data"]["id"]
        logger.info("Donation created successfully: " + str(payment_id))
        return jsonify({'status': 'success', 'data' : {"payment_url" : payment_url, "payment_id" : payment_id}}), 200 # Successful response with payment URL and ID
    else:
        return jsonify({"error": "User not found"}), 404


@payment_bp.route('/webhook/coinbase', methods=['POST'])
def payment_webhook():
    logger.info("Coinbase webhook received")
    headers = request.headers
    signature = headers.get("X-CC-Webhook-Signature")

    # Check signature

    if not signature:
        logger.warning("Missing signature")
        return jsonify({'error': 'Missing signature'}), 400
    
    computed_sig = hmac.new(COINBASE_WEBHOOK_SECRET.encode(), request.data, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(computed_sig, signature):
        logger.warning("Invalid signature")
        return jsonify({'error': 'Invalid signature'}), 400

    data = request.json
    event = data["event"]["type"]
    transaction_id = data["event"]["data"]["id"]

    # Check if the transaction exists

    res = transactions_collection.find_one({"payment_id": transaction_id})

    if not res:
        logger.warning("No donation found for payment ID: " + str(transaction_id))
        return jsonify({'error': 'No donation found'}), 404

    # Doesnt need to handle all events, only the relevant ones
    # Does not handle charge:created since the transaction status is already "created" when the transaction is created in the database

    event_mapping = { 
        "charge:confirmed": "paid",
        "charge:pending": "pending_payment",
        "charge:failed": "failed"
    }

    if event in event_mapping: # Handle known events
        status = event_mapping[event]
        user_id = res["user_id"]
        res = transactions_collection.find_one_and_update({"payment_id": transaction_id}, {"$set": {"status": status}}, return_document=ReturnDocument.AFTER) # Update transaction status
        if status == "paid": # Update user balance on successful payment
            users_collection.find_one_and_update({"discord_id": user_id}, {"$inc": {"balance": res["amount"]}})
            logger.success("Payment successful")

            # EMAIL NOTIFICATIONS NOT IMPLEMENTED YET MAYBE IN THE FUTURE
            #try:
            #    msg = Message("Donation Successful",sender=app.config["MAIL_USERNAME"] ,recipients=[res["email"]])
            #    msg.html = render_template("email.html",
            #                            company_name=COMPANY_NAME,
            #                            donor_name=res["donor_name"],
            #                            amount=res["amount"],
            #                            email=res["email"],
            #                            payment_id=res["payment_id"],
            #                            year=datetime.now().year
            #                            )
            #    mail.send(msg)
            #    logger.info("Email sent successfully to " + str(res["email"]))
            #except Exception as e:
            #    logger.error("Error sending email: " + str(e))
    else:
        logger.info("Unhandled event type: " + str(event)) #Other events like created
    return jsonify({'status': 'success'}), 200