import requests

DISCORD_API_BASE = "https://discord.com/api"
class DiscordOAuth:
    def __init__(self, client_id, client_secret, redirect_uri):
        self.client_id = client_id
        self.client_secret = client_secret
        self.redirect_uri = redirect_uri
        self.scope = "identify email"

    def get_access_token(self, code):
        data = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": self.redirect_uri,
            "scope": self.scope,
        }

        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        token_response = requests.post(f"{DISCORD_API_BASE}/oauth2/token", data=data, headers=headers)
        if token_response.status_code == 200:
            return token_response.json().get("access_token")
        return None

    def get_user_info(self, access_token):
        headers = {"Authorization": f"Bearer {access_token}"}
        user_response = requests.get(f"{DISCORD_API_BASE}/users/@me", headers=headers)
        if user_response.status_code == 200:
            return user_response.json()
        return None