import { useState, useEffect } from 'react'
import config from './config.js'
import { Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

function Callback() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (code) {
            async function fetchToken() {
                const response = await fetch(`${config.API_BASE}/discord/callback`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({"code" : code })
                });
                if (response.ok) {
                    const data = await response.json();
                    localStorage.access_token = data.access_token;
                    navigate("/dashboard");
                } else {
                    setError("Failed to fetch access token, check callback URL in Discord and env settings.");
                    setLoading(false);
                }
                
            }
            fetchToken();
        } else {
            navigate("/login"); // Redirect to login if no code
        }
    }, []);
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}
        </div>
    );

}

export default Callback
