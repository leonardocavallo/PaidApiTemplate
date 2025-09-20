
# CONFIGURATION

---

## Docker Deployment Guide

This project is designed to run easily with Docker. Follow these steps to deploy the backend using Docker:

### 1. Clone the Repository

```sh
git clone https://github.com/leonardocavallo/PaidApiTemplate.git
cd PaidApiTemplate
```


### 2. Configure Environment Variables

Copy the example environment file and fill in your secrets:

```sh
cp Backend/.env.example Backend/.env
```

Open `Backend/.env` and set the following variables:

#### Discord OAuth2 Setup

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications) and click "New Application".
2. Name your app and save.
3. Go to "OAuth2" page and copy your `CLIENT_ID` and `CLIENT_SECRET`.
4. Under the same page, add your redirect URL (e.g. `http://yourdomain.com/callback` for your deployed frontend URL).
5. Paste these values into your `.env`:
	- `CLIENT_ID`
	- `CLIENT_SECRET`
	- `DISCORD_REDIRECT_URL`

#### MongoDB Setup (Recommended: MongoDB Atlas)

> **Why Atlas?**
>
> Hosting the latest MongoDB server on older hardware or VPS can be problematic due to AVX instruction requirements. [MongoDB Atlas](https://www.mongodb.com/atlas/database) offers a generous free tier, is cloud-hosted, and is very reliable.

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database) and create a free cluster.
2. Whitelist your IP or set access to 0.0.0.0/0 for development.
3. Create a database user that has edit permissions and copy the connection string (e.g. `mongodb+srv://<user>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority`).
4. Paste this string into `MONGODB_URL` in your `.env` file.
5. Set `MONGODB_NAME` to database collection name (e.g. paid_api).

#### JWT Secret

Set `JWT_SECRET_KEY` to a strong, random string. This is used for signing authentication tokens.

#### Coinbase Commerce Payments (Optional)

> [!NOTE]
> Payments are **optional** and can be disabled by setting `ENABLE_PAYMENTS = "False"` in your `.env` file.

If you want to enable crypto payments:

1. Go to [Coinbase Commerce](https://beta.commerce.coinbase.com/payments) and create an account.
2. Generate an API key and webhook secret.
3. Set up a webhook endpoint (e.g. `http://yourdomain.com/webhook/coinbase`).
4. Fill in these variables in your `.env`:
	- `ENABLE_PAYMENTS = "True"`
	- `COINBASE_API_KEY`
	- `COINBASE_WEBHOOK_SECRET`
	- `COINBASE_COMPANY_NAME`

If you do **not** want to accept payments, leave `ENABLE_PAYMENTS` as `False` and you can ignore the other Coinbase variables.

### 3. Build and Run with Docker Compose

```sh
docker-compose up --build
```


This will build the image and start the server on port 5000.

The backend automatically serves the built React frontend from the `Backend/static/` directory. After building the frontend (see LOCAL_DEVELOPMENT.md), users accessing the backend server will see the dashboard UI.

---

## Additional Notes

- The backend runs on port 5000 by default.
- For production, set strong secrets and restrict MongoDB ip address network access.
- For Coinbase payments, set up webhooks as described in `.env.example`.

---

For local development instructions look at [Local Development Guide](LOCAL_DEVELOPMENT.md).