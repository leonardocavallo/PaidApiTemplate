import requests

class Payments:
    def __init__(self, api_key: str, currency: str = "USD"):
        self.api_key = api_key
        self.currency = currency
        self.base_url = "https://api.commerce.coinbase.com"

    def get_checkouts(self):
        r = requests.get(f"{self.base_url}/checkouts", headers={
            "X-CC-Api-Key": self.api_key,
        })
        return r.json()
    
    def create_checkout(self, name:str, description:str, amount:float):
        data = {
            "name" : name,
            "description": description,
            "pricing_type": "fixed_price",
            "local_price" : {
                "amount": amount,
                "currency": self.currency
            },
        }
        r = requests.post(f"{self.base_url}/charges/", json=data, headers={
            "X-CC-Api-Key": self.api_key,
            "Content-Type": "application/json"
        })
        return r.json()