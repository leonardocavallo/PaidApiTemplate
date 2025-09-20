# LOCAL DEVELOPMENT GUIDE

---

## 1. Clone the Repository

```sh
git clone https://github.com/leonardocavallo/PaidApiTemplate.git
cd PaidApiTemplate
```

## 2. Backend Setup

Install Python dependencies:

```sh
pip install -r Backend/requirements.txt
```

Run the backend in debug mode:

```sh
python start_debug_backend.py
```
This will start the backend server on port 3000 (for local development).

> [!CAUTION]
> Do not use start_debug_backend.py to deploy the application as it's insecure
> For production deployment see [Configuration Guide](CONFIG.md)

## 3. Frontend Setup

Go to the frontend folder and install Node.js dependencies:

```sh
cd Frontend
npm install
```


Start the Vite development server:

```sh
npm run dev
```
The frontend will be available at `http://localhost:5173` by default.

> [!IMPORTANT]
> **Note:** Keep the Flask backend running in a separate terminal while using the Vite development server. The frontend will proxy API requests to the backend during development.

## 4. Build React Frontend for Backend

To build the React frontend and copy static files to the backend, run:

```sh
./build_frontend.sh
```
This will build the frontend and place the output in `Backend/static/`.

---

## 5. Important Notes

- **Discord Callback URL:**
	- When developing locally, set your Discord application's redirect URL to `http://localhost:5173/callback` (or the port your Vite dev server uses).
	- If you build and serve the frontend via backend, use `http://localhost:3000/callback`.

- **Coinbase Webhooks (Development):**
	- For local testing, you can use [ngrok](https://ngrok.com/) to expose your backend to the internet and receive Coinbase webhook events.
	- Example: `ngrok http 3000` and set your webhook URL in Coinbase to `https://<your-ngrok-id>.ngrok.io/webhook/coinbase`.

---

For Docker deployment, see [Configuration Guide](CONFIG.md).